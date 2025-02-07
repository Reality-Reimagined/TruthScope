from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
from loguru import logger
import json
from pathlib import Path
import time
import re
from dotenv import load_dotenv
from google import genai
from google.genai import types
import yt_dlp
import tempfile
import mimetypes
import requests

# Load environment variables
load_dotenv()

# Configure logging with more detailed format
logger.add(
    "logs/app.log",
    rotation="500 MB",
    retention="10 days",
    level="DEBUG",
    format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
    backtrace=True,
    diagnose=True
)

app = FastAPI(
    title="Political Video Analysis API",
    description="AI-powered analysis of political videos using Google Gemini",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY is required")

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)
MODEL_NAME = "gemini-2.0-flash"

class ProcessingStep(BaseModel):
    step: str
    status: str  # 'pending' | 'in_progress' | 'complete' | 'error'
    message: str
    progress: float

class AnalysisState(BaseModel):
    status: str
    progress: float
    message: str
    timestamp: datetime
    steps: List[ProcessingStep] = []

class AnalysisDetail(BaseModel):
    emotion: str
    confidence: float
    description: str
    posture: Optional[str] = None
    gesture: Optional[str] = None

class AnalysisResult(BaseModel):
    timestamp: float
    facialExpression: AnalysisDetail
    bodyPosture: AnalysisDetail
    handGestures: AnalysisDetail
    overallEmotion: str
    confidenceScore: float
    analysis: str

class VideoAnalysis(BaseModel):
    id: str
    state: AnalysisState
    results: Optional[List[AnalysisResult]] = None

# In-memory store for analysis states
analysis_states: Dict[str, VideoAnalysis] = {}

def update_analysis_state(analysis_id: str, step_index: int, status: str, progress: float, message: str):
    """Helper function to update analysis state"""
    if analysis_id in analysis_states:
        analysis = analysis_states[analysis_id]
        if step_index < len(analysis.state.steps):
            # Update specific step
            analysis.state.steps[step_index].status = status
            analysis.state.steps[step_index].progress = progress
            analysis.state.steps[step_index].message = message
            
            # Update overall progress based on all steps
            total_progress = sum(step.progress for step in analysis.state.steps) / len(analysis.state.steps)
            analysis.state.progress = total_progress
            analysis.state.message = message
            analysis.state.timestamp = datetime.now()
            
            logger.info(f"Updated analysis state - ID: {analysis_id}, Step: {step_index}, Status: {status}, Progress: {progress:.2f}")

def create_initial_analysis_state(analysis_id: str) -> VideoAnalysis:
    """Create initial analysis state with steps"""
    initial_steps = [
        ProcessingStep(
            step="Upload Video",
            status="pending",
            message="Waiting to start upload",
            progress=0.0
        ),
        ProcessingStep(
            step="Process Video",
            status="pending",
            message="Waiting for video processing",
            progress=0.0
        ),
        ProcessingStep(
            step="AI Analysis",
            status="pending",
            message="Waiting for AI analysis",
            progress=0.0
        )
    ]

    return VideoAnalysis(
        id=analysis_id,
        state=AnalysisState(
            status="uploading",
            progress=0.0,
            message="Starting analysis",
            timestamp=datetime.now(),
            steps=initial_steps
        )
    )

@app.post("/analyze/upload", response_model=VideoAnalysis)
async def analyze_uploaded_video(
    file: Optional[UploadFile] = None,
    youtube_url: Optional[str] = Form(None)
):
    try:
        analysis_id = f"analysis_{datetime.now().timestamp()}"
        analysis_states[analysis_id] = create_initial_analysis_state(analysis_id)
        
        # Start upload step
        update_analysis_state(analysis_id, 0, "in_progress", 0.1, "Starting upload")
        
        if not file and not youtube_url:
            raise HTTPException(
                status_code=400,
                detail="Either file or youtube_url must be provided"
            )

        file_path = None
        try:
            if youtube_url:
                logger.info(f"Processing YouTube URL: {youtube_url}")
                file_path = f"temp/youtube_{analysis_id}.mp4"
                
                ydl_opts = {
                    'format': 'best[ext=mp4]',
                    'outtmpl': file_path,
                    'progress_hooks': [lambda d: handle_progress(d, analysis_id)],
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    logger.info("Starting YouTube video download...")
                    ydl.download([youtube_url])
                    logger.info("YouTube video download completed")
                    update_analysis_state(analysis_id, 0, "complete", 1.0, "YouTube video downloaded")
            else:
                file_path = f"temp/{file.filename}"
                logger.info(f"Saving uploaded file: {file.filename}")
                
                # Stream file content and update progress
                with open(file_path, "wb") as buffer:
                    content = await file.read()
                    buffer.write(content)
                    update_analysis_state(analysis_id, 0, "complete", 1.0, "File upload complete")

            # Start processing step
            update_analysis_state(analysis_id, 1, "in_progress", 0.0, "Processing video")
            
            # Upload to Gemini
            uploaded_file = client.files.upload(file=file_path)
            update_analysis_state(analysis_id, 1, "in_progress", 0.5, "Video uploaded to AI service")
            
            # Wait for file to become active
            max_attempts = 30
            for attempt in range(max_attempts):
                file_info = client.files.get(name=uploaded_file.name)
                if getattr(file_info, "state", None) == "ACTIVE":
                    uploaded_file = file_info
                    update_analysis_state(analysis_id, 1, "complete", 1.0, "Video processing complete")
                    break
                elif getattr(file_info, "state", None) == "FAILED":
                    raise HTTPException(status_code=500, detail="Video processing failed")
                
                progress = (attempt + 1) / max_attempts * 0.5 + 0.5
                update_analysis_state(
                    analysis_id, 1, "in_progress", 
                    progress, f"Processing video... {int(progress * 100)}%"
                )
                time.sleep(2)
            else:
                raise HTTPException(status_code=500, detail="Video processing timeout")

            # Start AI analysis step
            update_analysis_state(analysis_id, 2, "in_progress", 0.0, "Starting AI analysis")
            
            prompt = """
            Analyze this video segment focusing on the speaker's behavior. Provide detailed information in JSON format about:
            1. Facial expressions and emotions - describe the speaker's facial movements, micro-expressions, and emotional indicators
            2. Body posture and stance - analyze the speaker's positioning, posture shifts, and what they indicate about confidence/state of mind
            3. Hand gestures and their meanings - interpret specific hand movements and their communicative intent
            4. Overall emotional state and authenticity - provide a comprehensive interpretation of the speaker's emotional state and perceived authenticity
            
            Include confidence scores (0-1) and detailed behavioral descriptions for each observation.
            Focus on how these elements combine to convey the speaker's message and emotional state.
            """

            update_analysis_state(analysis_id, 2, "in_progress", 0.3, "Generating AI analysis")
            
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[uploaded_file, prompt],
                config=types.GenerateContentConfig(max_output_tokens=1000)
            )

            update_analysis_state(analysis_id, 2, "in_progress", 0.7, "Processing AI results")

            # Parse and structure the results
            try:
                structured_results = parse_gemini_response(response.text)
                
                # Update final state
                analysis_states[analysis_id].state.status = "complete"
                analysis_states[analysis_id].state.progress = 1.0
                analysis_states[analysis_id].state.message = "Analysis complete"
                analysis_states[analysis_id].results = structured_results
                update_analysis_state(analysis_id, 2, "complete", 1.0, "Analysis complete")

                logger.info(f"Analysis completed successfully for ID: {analysis_id}")
                return analysis_states[analysis_id]

            except Exception as e:
                logger.error(f"Error parsing AI response: {str(e)}")
                raise HTTPException(status_code=500, detail="Failed to parse AI analysis results")

        finally:
            # Cleanup
            if file_path and os.path.exists(file_path):
                os.remove(file_path)

    except Exception as e:
        logger.error(f"Error in analysis process: {str(e)}")
        if analysis_id in analysis_states:
            analysis_states[analysis_id].state.status = "error"
            analysis_states[analysis_id].state.message = str(e)
            # Mark all remaining steps as error
            for step in analysis_states[analysis_id].state.steps:
                if step.status == "pending" or step.status == "in_progress":
                    step.status = "error"
                    step.message = "Failed due to error"
        raise HTTPException(status_code=500, detail=str(e))

def handle_progress(d, analysis_id):
    """Handle progress updates for YouTube downloads"""
    if d['status'] == 'downloading':
        try:
            total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            if total_bytes:
                downloaded = d.get('downloaded_bytes', 0)
                progress = (downloaded / total_bytes)
                update_analysis_state(
                    analysis_id, 0, "in_progress", 
                    progress, f"Downloading video: {int(progress * 100)}%"
                )
        except Exception as e:
            logger.error(f"Error updating download progress: {str(e)}")

@app.get("/analysis/{analysis_id}", response_model=VideoAnalysis)
async def get_analysis_status(analysis_id: str):
    logger.info(f"Fetching analysis status for ID: {analysis_id}")
    if analysis_id not in analysis_states:
        logger.warning(f"Analysis ID not found: {analysis_id}")
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis_states[analysis_id]

def parse_gemini_response(response_text: str) -> List[AnalysisResult]:
    """Parse and structure the Gemini API response."""
    try:
        # Clean up the response text
        json_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?})\s*```", response_text)
        if not json_match:
            # Try to find a JSON object without code blocks
            json_match = re.search(r'\{[\s\S]*?"observations":\s*\[([\s\S]*?)\]', response_text)
            if not json_match:
                raise ValueError("No valid JSON found in response")
        
        json_str = json_match.group(1)
        
        # Try to parse the JSON
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            # If parsing fails, try to extract just the observations array
            obs_match = re.search(r'"observations":\s*(\[[\s\S]*?\])', json_str)
            if obs_match:
                observations = json.loads(obs_match.group(1))
            else:
                raise ValueError("Could not parse observations from response")
        else:
            observations = data.get("videoAnalysis", {}).get("observations", [])

        # Find the relevant observations
        facial = next((obs for obs in observations if obs["category"] == "Facial Expressions and Emotions"), {})
        posture = next((obs for obs in observations if obs["category"] == "Body Posture and Stance"), {})
        gestures = next((obs for obs in observations if obs["category"] == "Hand Gestures and Meanings"), {})
        overall = next((obs for obs in observations if obs["category"] == "Overall Emotional State"), {})

        # Create the analysis result
        result = AnalysisResult(
            timestamp=0.0,  # Default to start of video
            facialExpression=AnalysisDetail(
                emotion=facial.get("emotionDetected", [{}])[0].get("emotion", "Unknown"),
                confidence=float(facial.get("emotionDetected", [{}])[0].get("confidence", 0.0)),
                description=facial.get("description", "")
            ),
            bodyPosture=AnalysisDetail(
                emotion=posture.get("details", {}).get("posture", "Unknown"),
                confidence=float(posture.get("confidence", 0.0)),
                description=posture.get("description", ""),
                posture=posture.get("details", {}).get("posture", "Unknown")
            ),
            handGestures=AnalysisDetail(
                emotion=gestures.get("details", {}).get("gesture", "Unknown"),
                confidence=float(gestures.get("confidence", 0.0)),
                description=gestures.get("description", ""),
                gesture=gestures.get("details", {}).get("gesture", "Unknown")
            ),
            overallEmotion=overall.get("emotion", "Unknown"),
            confidenceScore=float(overall.get("confidence", 0.85)),
            analysis=overall.get("description", "")
        )
        
        return [result]

    except Exception as e:
        logger.error(f"Error parsing Gemini response: {e}")
        raise ValueError(f"Failed to parse Gemini response: {str(e)}")



# from fastapi import FastAPI, File, UploadFile, HTTPException, Form
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional, Dict
# from datetime import datetime
# import os
# from loguru import logger
# import json
# from pathlib import Path
# import time
# import re
# from dotenv import load_dotenv
# from google import genai
# from google.genai import types
# import yt_dlp
# import tempfile
# import mimetypes
# import requests

# # Load environment variables
# load_dotenv()

# # Configure logging
# logger.add(
#     "logs/app.log",
#     rotation="500 MB",
#     retention="10 days",
#     level="DEBUG",
#     format="{time:YYYY-MM-DD at HH:mm:ss} | {level} | {message}",
#     backtrace=True,
#     diagnose=True
# )

# app = FastAPI(
#     title="Political Video Analysis API",
#     description="AI-powered analysis of political videos using Google Gemini",
#     version="1.0.0"
# )

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, replace with specific origins
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure Gemini AI
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# if not GEMINI_API_KEY:
#     logger.error("GEMINI_API_KEY not found in environment variables")
#     raise ValueError("GEMINI_API_KEY is required")

# # Initialize Gemini client
# client = genai.Client(api_key=GEMINI_API_KEY)
# MODEL_NAME = "gemini-2.0-flash"  # Using the pro model for better analysis

# class ProcessingStep(BaseModel):
#     step: str
#     status: str  # 'pending' | 'in_progress' | 'complete' | 'error'
#     message: str
#     progress: float

# class AnalysisState(BaseModel):
#     status: str
#     progress: float
#     message: str
#     timestamp: datetime
#     steps: List[ProcessingStep] = []

# class AnalysisDetail(BaseModel):
#     emotion: str
#     confidence: float

# class AnalysisResult(BaseModel):
#     timestamp: float
#     facialExpression: AnalysisDetail
#     bodyPosture: AnalysisDetail
#     handGestures: AnalysisDetail
#     overallEmotion: str
#     confidenceScore: float
#     analysis: str

# class VideoAnalysis(BaseModel):
#     id: str
#     state: AnalysisState
#     results: Optional[List[AnalysisResult]] = None

# # Define the schema for our response
# class EmotionDetail(BaseModel):
#     emotion: str
#     confidence: float
#     description: str

# class PostureDetail(BaseModel):
#     posture: str
#     confidence: float
#     description: str

# class GestureDetail(BaseModel):
#     gesture: str
#     confidence: float
#     description: str

# class OverallAnalysis(BaseModel):
#     emotion: str
#     confidence: float
#     description: str

# class PersonAnalysis(BaseModel):
#     facialExpressionsAndEmotions: List[EmotionDetail]
#     bodyPostureAndStance: List[PostureDetail]
#     handGesturesAndMeanings: List[GestureDetail]
#     overallAnalysis: OverallAnalysis

# class VideoAnalysisResponse(BaseModel):
#     timeSegment: str
#     person: PersonAnalysis

# # In-memory store for analysis states (replace with database in production)
# analysis_states: Dict[str, VideoAnalysis] = {}

# def parse_gemini_response(response_text: str) -> List[AnalysisResult]:
#     """Parse and structure the Gemini API response."""
#     try:
#         # Clean up the response text
#         json_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?})\s*```", response_text)
#         if not json_match:
#             # Try to find a JSON object without code blocks
#             json_match = re.search(r'\{[\s\S]*?"observations":\s*\[([\s\S]*?)\]', response_text)
#             if not json_match:
#                 raise ValueError("No valid JSON found in response")
        
#         json_str = json_match.group(1)
        
#         # Try to parse the JSON
#         try:
#             data = json.loads(json_str)
#         except json.JSONDecodeError:
#             # If parsing fails, try to extract just the observations array
#             obs_match = re.search(r'"observations":\s*(\[[\s\S]*?\])', json_str)
#             if obs_match:
#                 observations = json.loads(obs_match.group(1))
#             else:
#                 raise ValueError("Could not parse observations from response")
#         else:
#             observations = data.get("videoAnalysis", {}).get("observations", [])

#         # Find the relevant observations
#         facial = next((obs for obs in observations if obs["category"] == "Facial Expressions and Emotions"), {})
#         posture = next((obs for obs in observations if obs["category"] == "Body Posture and Stance"), {})
#         gestures = next((obs for obs in observations if obs["category"] == "Hand Gestures and Meanings"), {})
#         overall = next((obs for obs in observations if obs["category"] == "Overall Emotional State"), {})

#         # Create the analysis result
#         result = AnalysisResult(
#             timestamp=0.0,  # Default to start of video
#             facialExpression=AnalysisDetail(
#                 emotion=facial.get("emotionDetected", [{}])[0].get("emotion", "Unknown"),
#                 confidence=float(facial.get("emotionDetected", [{}])[0].get("confidence", 0.0))
#             ),
#             bodyPosture=AnalysisDetail(
#                 emotion=posture.get("details", {}).get("initialStance", "Unknown"),
#                 confidence=float(posture.get("confidence", 0.0))
#             ),
#             handGestures=AnalysisDetail(
#                 emotion=gestures.get("details", {}).get("golfGrip", "Unknown"),
#                 confidence=float(gestures.get("confidence", 0.0))
#             ),
#             overallEmotion="Focused and Controlled",  # Default based on common golf analysis
#             confidenceScore=0.85  # Default confidence for overall assessment
#         )
        
#         return [result]

#     except Exception as e:
#         logger.error(f"Error parsing Gemini response: {e}")
#         raise ValueError(f"Failed to parse Gemini response: {str(e)}")

# @app.post("/analyze/upload", response_model=VideoAnalysis)
# async def analyze_uploaded_video(
#     file: Optional[UploadFile] = None,
#     youtube_url: Optional[str] = Form(None)
# ):
#     try:
#         analysis_id = f"analysis_{datetime.now().timestamp()}"
        
#         # Initialize with processing steps
#         initial_steps = [
#             ProcessingStep(
#                 step="upload",
#                 status="pending",
#                 message="Waiting to start",
#                 progress=0.0
#             ),
#             ProcessingStep(
#                 step="preprocessing",
#                 status="pending",
#                 message="Waiting to start",
#                 progress=0.0
#             ),
#             ProcessingStep(
#                 step="analysis",
#                 status="pending",
#                 message="Waiting to start",
#                 progress=0.0
#             )
#         ]

#         analysis_states[analysis_id] = VideoAnalysis(
#             id=analysis_id,
#             state=AnalysisState(
#                 status="uploading",
#                 progress=0.0,
#                 message="Starting upload",
#                 timestamp=datetime.now(),
#                 steps=initial_steps
#             )
#         )

#         # Update steps as processing continues...
#         analysis_states[analysis_id].state.steps[0].status = "in_progress"

#         # Validate input
#         if not file and not youtube_url:
#             raise HTTPException(
#                 status_code=400,
#                 detail="Either file or youtube_url must be provided"
#             )

#         # Handle YouTube URL
#         if youtube_url:
#             try:
#                 logger.info(f"Processing YouTube URL: {youtube_url}")
#                 analysis_states[analysis_id].state = AnalysisState(
#                     status="processing",
#                     progress=0.1,
#                     message="Downloading YouTube video...",
#                     timestamp=datetime.now()
#                 )
                
#                 file_path = f"temp/youtube_{analysis_id}.mp4"
                
#                 # Configure yt-dlp options
#                 ydl_opts = {
#                     'format': 'best[ext=mp4]',  # Get best quality MP4
#                     'outtmpl': file_path,
#                     'progress_hooks': [(lambda d: handle_progress(d, analysis_id))],
#                 }
                
#                 # Download the video
#                 with yt_dlp.YoutubeDL(ydl_opts) as ydl:
#                     logger.info("Starting YouTube video download...")
#                     ydl.download([youtube_url])
#                     logger.info("YouTube video download completed")
                
#             except Exception as e:
#                 logger.error(f"YouTube download error: {str(e)}")
#                 raise HTTPException(status_code=400, detail=f"Error processing YouTube video: {str(e)}")
#         else:
#             # Handle direct file upload
#             file_path = f"temp/{file.filename}"
#             logger.info(f"Saving uploaded file: {file.filename}")
            
#             with open(file_path, "wb") as buffer:
#                 content = await file.read()
#                 buffer.write(content)
#                 logger.info("File upload completed")

#         # Update state to processing
#         analysis_states[analysis_id].state = AnalysisState(
#             status="processing",
#             progress=0.4,
#             message="Processing video...",
#             timestamp=datetime.now()
#         )

#         # Process the video file
#         try:
#             logger.info("Starting Gemini analysis process...")
#             with open(file_path, 'rb') as video_file:
#                 # Upload to Gemini
#                 logger.info("Uploading file to Gemini...")
#                 uploaded_file = client.files.upload(file=file_path)
                
#                 # Wait for file to become active
#                 for attempt in range(30):
#                     logger.info(f"Checking file status - attempt {attempt + 1}/30")
#                     file_info = client.files.get(name=uploaded_file.name)
#                     if getattr(file_info, "state", None) == "ACTIVE":
#                         logger.info("File successfully processed by Gemini")
#                         uploaded_file = file_info
#                         break
#                     elif getattr(file_info, "state", None) == "FAILED":
#                         logger.error("File processing failed in Gemini")
#                         raise HTTPException(status_code=500, detail="File processing failed")
                    
#                     logger.info(f"File still processing, waiting... (State: {getattr(file_info, 'state', 'UNKNOWN')})")
#                     time.sleep(2)
#                 else:
#                     logger.error("File processing timeout in Gemini")
#                     raise HTTPException(status_code=500, detail="File processing timeout")

#         except Exception as e:
#             logger.error(f"Error during Gemini file processing: {str(e)}")
#             raise HTTPException(status_code=500, detail=str(e))

#         # Continue with the rest of your analysis code...

#         # Update state to processing
#         analysis_states[analysis_id].state = AnalysisState(
#             status="processing",
#             progress=0.7,
#             message="Analyzing video content",
#             timestamp=datetime.now()
#         )

#         # Define the analysis prompt
#         prompt = (
#             "Analyze this video segment focusing on the speaker's behavior. Provide detailed information in JSON format about: "
#             "1. Facial expressions and emotions - describe the speaker's facial movements, micro-expressions, and emotional indicators, "
#             "2. Body posture and stance - analyze the speaker's positioning, posture shifts, and what they indicate about confidence/state of mind, "
#             "3. Hand gestures and their meanings - interpret specific hand movements and their communicative intent, "
#             "4. Overall emotional state and authenticity - provide a comprehensive interpretation of the speaker's emotional state and perceived authenticity. "
#             "Include confidence scores (0-1) and detailed behavioral descriptions for each observation. "
#             "Focus on how these elements combine to convey the speaker's message and emotional state."
#         )

#         logger.info("Generating content with Gemini...")
#         response = client.models.generate_content(
#             model=MODEL_NAME,
#             contents=[uploaded_file, prompt],
#             config=types.GenerateContentConfig(
#                 response_mime_type="application/json",
#                 response_schema=VideoAnalysisResponse,
#                 max_output_tokens=1000
#             )
#         )

#         logger.info("Processing Gemini response...")
#         logger.debug(f"Raw Gemini response: {response.text}")

#         # Parse the response
#         try:
#             data = json.loads(response.text)
#             logger.debug(f"Parsed JSON data: {data}")
#             person_data = data.get('person', {})
            
#             # Get the highest confidence entries with descriptions
#             facial = max(person_data.get('facialExpressionsAndEmotions', []), 
#                         key=lambda x: x.get('confidence', 0), 
#                         default={})
#             posture = max(person_data.get('bodyPostureAndStance', []), 
#                          key=lambda x: x.get('confidence', 0), 
#                          default={})
#             gesture = max(person_data.get('handGesturesAndMeanings', []), 
#                          key=lambda x: x.get('confidence', 0), 
#                          default={})
#             overall = person_data.get('overallAnalysis', {})

#             # Create the analysis result with descriptions
#             result = AnalysisResult(
#                 timestamp=0.0,
#                 facialExpression=AnalysisDetail(
#                     emotion=facial.get('emotion', 'Unknown'),
#                     confidence=float(facial.get('confidence', 0.0)),
#                     description=facial.get('description', '')
#                 ),
#                 bodyPosture=AnalysisDetail(
#                     emotion=posture.get('posture', 'Unknown'),
#                     confidence=float(posture.get('confidence', 0.0)),
#                     description=posture.get('description', '')
#                 ),
#                 handGestures=AnalysisDetail(
#                     emotion=gesture.get('gesture', 'Unknown'),
#                     confidence=float(gesture.get('confidence', 0.0)),
#                     description=gesture.get('description', '')
#                 ),
#                 overallEmotion=overall.get('emotion', 'Unknown'),
#                 confidenceScore=float(overall.get('confidence', 0.0)),
#                 analysis=overall.get('description', '')
#             )

#             # Update final state
#             analysis_states[analysis_id].state = AnalysisState(
#                 status="complete",
#                 progress=1.0,
#                 message="Analysis complete",
#                 timestamp=datetime.now()
#             )
#             analysis_states[analysis_id].results = [result]

#             logger.info("Analysis completed successfully")
            
#             return analysis_states[analysis_id]

#         except json.JSONDecodeError as e:
#             logger.error(f"Error parsing Gemini response: {e}")
#             logger.debug(f"Problematic response text: {response.text}")
#             raise HTTPException(status_code=500, detail="Failed to parse analysis results")
#         except Exception as e:
#             logger.error(f"Error processing analysis: {str(e)}")
#             raise HTTPException(status_code=500, detail="Failed to process analysis results")

#     except Exception as e:
#         logger.error(f"Error processing video: {str(e)}")
#         if analysis_id in analysis_states:
#             analysis_states[analysis_id].state = AnalysisState(
#                 status="error",
#                 progress=0,
#                 message=str(e),
#                 timestamp=datetime.now()
#             )
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         # Cleanup
#         if 'file_path' in locals() and os.path.exists(file_path):
#             logger.info(f"Cleaning up temporary file: {file_path}")
#             os.remove(file_path)

# @app.get("/analysis/{analysis_id}", response_model=VideoAnalysis)
# async def get_analysis_status(analysis_id: str):
#     logger.info(f"Fetching analysis status for ID: {analysis_id}")
#     if analysis_id not in analysis_states:
#         logger.warning(f"Analysis ID not found: {analysis_id}")
#         raise HTTPException(status_code=404, detail="Analysis not found")
#     return analysis_states[analysis_id]

# # Add this helper function for progress tracking
# def handle_progress(d, analysis_id):
#     if d['status'] == 'downloading':
#         try:
#             total_bytes = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
#             if total_bytes:
#                 downloaded = d.get('downloaded_bytes', 0)
#                 percentage = (downloaded / total_bytes)
#                 logger.info(f"Download progress: {int(percentage * 100)}%")
#                 analysis_states[analysis_id].state = AnalysisState(
#                     status="processing",
#                     progress=0.1 + (percentage * 0.2),  # Scale to 10-30%
#                     message=f"Downloading video: {int(percentage * 100)}%",
#                     timestamp=datetime.now()
#                 )
#         except Exception as e:
#             logger.error(f"Error updating progress: {str(e)}")
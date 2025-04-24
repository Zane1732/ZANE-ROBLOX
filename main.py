from flask import Flask, render_template, send_from_directory, request, jsonify
import os
import requests

app = Flask(__name__, 
            static_url_path='', 
            static_folder='.',
            template_folder='.')

# Gemini API key
GEMINI_API_KEY = 'AIzaSyALRZWP11fcLY5HVSGHJWlAG_asSPJdKAA'

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/video-test')
def video_test():
    return send_from_directory('.', 'video-test.html')

@app.route('/api/chat', methods=['POST'])
def proxy_gemini():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Make request to Gemini API (using Gemini 2.0-flash model)
        api_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}'
        
        payload = {
            'contents': [
                {
                    'parts': [{'text': user_message}]
                }
            ]
        }
        
        response = requests.post(api_url, json=payload)
        
        if response.status_code == 200:
            gemini_data = response.json()
            
            if (gemini_data.get('candidates') and 
                gemini_data['candidates'][0].get('content') and 
                gemini_data['candidates'][0]['content'].get('parts') and 
                gemini_data['candidates'][0]['content']['parts'][0].get('text')):
                
                ai_response = gemini_data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': ai_response})
            else:
                return jsonify({'response': "I'm having trouble understanding right now. Can you try again?"})
        else:
            # Fallback response if API call fails
            return jsonify({'response': "Sorry, I'm not connected to my brain right now. Let's chat about something else!"})
    
    except Exception as e:
        print(f"Error in proxy: {str(e)}")
        return jsonify({'response': "There was a problem with our connection. Let's try again later!"}), 500

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
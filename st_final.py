import streamlit as st
import requests
import subprocess
import webbrowser
import os
import time
import zipfile

import subprocess


# Set page configuration
st.set_page_config(page_title="Artifacts Ai", layout="wide")

# Custom Styling
st.markdown(f"""
    <style>
        body {{
            background-color: white;
            color: black;
        }}
        @keyframes fadeIn {{ from {{opacity: 0;}} to {{opacity: 1;}} }}
        .main-title {{
            text-align: center;
            font-size: 2.5em;
            font-weight: bold;
            color: #4A90E2;
            animation: fadeIn 2s ease-in-out;
        }}
        .input-box, .submit-btn {{
            animation: fadeIn 1.5s ease-in-out;
        }}
        .stTextArea > div > div > textarea {{
            height: 80px !important;
        }}
        .fade-in {{ animation: fadeIn 1.5s ease-in-out; }}
    </style>
""", unsafe_allow_html=True)

API_KEY = "fbc41e2b2c5eb3ae16060b4dce94e1f5e557734e0c92f0dc528fdad99d717a8d"


# Title
st.markdown("<div class='main-title'>Artifacts - AI </div>", unsafe_allow_html=True)

# User input for generating new component
st.markdown("<div class='input-box fade-in'>", unsafe_allow_html=True)
user_input = st.text_area("Enter component description:", placeholder="Describe the React component...", height=80)
st.markdown("</div>", unsafe_allow_html=True)

# Generate Button
st.markdown("<div class='submit-btn fade-in'>", unsafe_allow_html=True)
if st.button("Generate"):
    if not user_input.strip():
        st.error("Please enter a description!")
    else:

        st.info("⏳ Thinking... Please wait.")
        try:
            response = requests.post(
                "https://artifacts-ai-backend.onrender.com/generate-react",
                json={"userInput": user_input},
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                data = response.json()
                if "code" in data:
                    st.success("✅ Component Generated Successfully!")

                    # Clean the code by removing triple backticks if they exist
                    full_code = data["code"].strip()  # Remove leading/trailing spaces
                    if full_code.startswith("```") and full_code.endswith("```"):
                        full_code = full_code[3:-3].strip()  # Remove the first & last 3 characters

                    # Display code with a typing effect
                    code_container = st.empty()
                    displayed_code = ""

                    for line in full_code.split("\n"):
                        displayed_code += line + "\n"
                        code_container.code(displayed_code, language="tsx")
                        time.sleep(0.1)  # Typing speed (adjustable)

                else:
                    st.error("❌ Error: No code returned.")
            else:
                st.error("❌ Error: Failed to generate component.")
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")


# Modify React Component
st.markdown("<div class='input-box fade-in'>", unsafe_allow_html=True)
modification_input = st.text_area("Enter modification instructions:", placeholder="Describe the changes...", height=80)
st.markdown("</div>", unsafe_allow_html=True)

if st.button("Modify"):
    if not modification_input.strip():
        st.error("Please enter modification instructions!")
    else:
        st.info("⏳ Modifying... Please wait.")
        try:
            response = requests.post(
                "https://artifacts-ai-backend.onrender.com/modify-react",
                json={"userInput": modification_input},
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                data = response.json()
                if "code" in data:
                    st.success("✅ Component Modified Successfully!")

                    # Clean the modified code by removing triple backticks if present
                    full_code = data["code"].strip()
                    if full_code.startswith("```") and full_code.endswith("```"):
                        full_code = full_code[3:-3].strip()

                    # Typing effect for displaying modified code
                    code_container = st.empty()
                    displayed_code = ""

                    for line in full_code.split("\n"):
                        displayed_code += line + "\n"
                        code_container.code(displayed_code, language="tsx")
                        time.sleep(0.1)  # Adjust typing speed as needed

                else:
                    st.error("❌ Error: No modified code returned.")
            else:
                st.error("❌ Error: Failed to modify component.")
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")


# Download Button
st.markdown("<div class='submit-btn fade-in'>", unsafe_allow_html=True)
if st.sidebar.button("Download"):
    # Define correct paths (relative to app root)
    add_file_path = "add.tsx"
    app_file_path = os.path.join("files", "App.tsx")
    zip_file_path = "files.zip"

    # Ensure files directory exists
    os.makedirs("files", exist_ok=True)

    try:
        # Copy content from add.tsx to files/App.tsx
        with open(add_file_path, 'r', encoding='utf-8') as add_file:
            add_content = add_file.read()

        with open(app_file_path, 'w', encoding='utf-8') as app_file:
            app_file.write(add_content)

        # Create a zip of the files/ directory
        with zipfile.ZipFile(zip_file_path, 'w') as zip_file:
            for foldername, subfolders, filenames in os.walk("files"):
                for filename in filenames:
                    file_path = os.path.join(foldername, filename)
                    zip_file.write(file_path, os.path.relpath(file_path, "files"))

        # Provide the download button
        with open(zip_file_path, "rb") as f:
            st.sidebar.download_button("Confirm Download", f, file_name="files.zip")
    
    except Exception as e:
        st.sidebar.error(f"❌ Error during download preparation: {e}")
    
    # Provide download link for the zip file
    with open(zip_file_path, "rb") as f:
        st.sidebar.download_button("Confirm Download", f, file_name="files.zip")

if st.sidebar.button("View Latest Component"):
    try:
        response = requests.get("https://artifacts-ai-backend.onrender.com/view-latest")
        if response.status_code == 200:
            data = response.json()
            if "code" in data:
                st.code(data["code"], language="tsx")
            else:
                st.error("❌ No code found.")
        else:
            st.error("❌ Error: Could not retrieve the latest component.")
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")

# ✅ Function to remove first & last line from add.tsx
def remove_first_and_last_line(file_path: str) -> None:
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()

        if len(lines) <= 2:
            return  # Too short to process

        first_line = lines[0].strip()
        last_line = lines[-1].strip()

        start = 1 if first_line.startswith(("```", '"""')) else 0
        end = -1 if last_line.startswith(("```", '"""')) else None

        with open(file_path, 'w', encoding='utf-8') as file:
            file.writelines(lines[start:end])
    except Exception as e:
        print(f"❌ Error cleaning file: {e}")

st.markdown("<div class='submit-btn fade-in'>", unsafe_allow_html=True)
if st.sidebar.button("Website Preview"):
    try:
        file_path = os.path.abspath("add.tsx")
        remove_first_and_last_line(file_path)
        st.write("🧹 Cleaned add.tsx for preview...")

        # Call backend to trigger sandbox creation
        response = requests.get("https://artifacts-ai-backend.onrender.com/preview")

        if response.status_code == 200:
            url = response.json().get("url")
            if url:
                st.success("✅ Preview Created!")
                st.markdown(f"[🔗 Open Preview]({url})", unsafe_allow_html=True)
                webbrowser.open(url)
            else:
                st.error("❌ Preview URL not found.")
        else:
            st.error("❌ Backend failed to generate preview.")
    
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")


    file_path = os.path.abspath("add.tsx")
    remove_first_and_last_line(file_path)
    # Simulate execution with overlay
    st.write("Executing script...")
    stdout = True

    # Hide overlay
    st.components.v1.html("<script>hideOverlay();</script>", height=0)

    

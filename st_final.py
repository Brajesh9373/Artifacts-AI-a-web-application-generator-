import streamlit as st
import requests
import subprocess
import webbrowser
import os
import time
import zipfile

import subprocess

subprocess.run(["node", "server.js"])

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
                "http://localhost:5000/generate-react",
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
                "http://localhost:5000/modify-react",
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
    # Copy content from add.tsx to files/App.tsx
    add_file_path = "D:\\artifacts-ai\\add.tsx"
    app_file_path = "D:\\artifacts-ai\\files\\App.tsx"
    
    with open(add_file_path, 'r', encoding='utf-8') as add_file:
        add_content = add_file.read()
    
    with open(app_file_path, 'w', encoding='utf-8') as app_file:
        app_file.write(add_content)
    
    # Create a zip file of the files/ directory
    zip_file_path = "D:\\artifacts-ai\\files.zip"
    with zipfile.ZipFile(zip_file_path, 'w') as zip_file:
        for foldername, subfolders, filenames in os.walk("D:\\artifacts-ai\\files"):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                zip_file.write(file_path, os.path.relpath(file_path, "D:\\artifacts-ai\\files"))
    
    # Provide download link for the zip file
    with open(zip_file_path, "rb") as f:
        st.sidebar.download_button("Confirm Download", f, file_name="files.zip")

if st.sidebar.button("View Latest Component"):
    try:
        response = requests.get("http://localhost:5000/view-latest")
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

if st.sidebar.button("Website Preview"):
    def run_script():
        try:
            result = subprocess.run(
                ["node","D:\\artifacts-ai\\sandbox_creator.js"],
                capture_output=True, text=True, shell=True, encoding="utf-8"
            )
            return result.stdout
        except Exception as e:
            return e
    
    def remove_first_and_last_line(file_path: str) -> None:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                lines = file.readlines()
            
            if len(lines) <= 2:
                return
            
            start = 1 if ('```' in lines[0] or '"""' in lines[0]) else 0
            end = -1 if ('```' in lines[-1] or '"""' in lines[-1]) else None
            
            with open(file_path, 'w', encoding='utf-8') as file:
                file.writelines(lines[start:end])
        except Exception as e:
            print(f"Error processing file: {e}")

    file_path = os.path.abspath("D:\\artifacts-ai\\add.tsx")
    remove_first_and_last_line(file_path)
    st.write("Executing script...")
    stdout = run_script()
    if stdout:
        filtered_output = "\n".join(
            line for line in stdout.split("\n") if "Creating sandbox..." not in line and "✅ Sandbox Created Successfully!" not in line
        )
        st.text_area("Output:", filtered_output, height=200)
        for line in filtered_output.split("\n"):
            if "Preview URL:" in line:
                url = line.split("Preview URL:")[1].strip()
                webbrowser.open(url)

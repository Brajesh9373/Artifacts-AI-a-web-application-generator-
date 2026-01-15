# Artifacts-AI: Web Application Generator

An AI-powered web application generator that transforms natural language descriptions into complete React applications with TypeScript and Tailwind CSS.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

- **Natural Language to Code**: Describe your component in plain English and get a complete React component
- **TypeScript Support**: All generated components use TypeScript for type safety
- **Tailwind CSS**: Styled with Tailwind CSS for beautiful, responsive designs
- **Interactive Components**: Generated components include state management and interactivity
- **Live Preview**: Instant preview of generated components in CodeSandbox
- **Downloadable Projects**: Export complete React projects as ZIP files
- **Component Modification**: Modify existing components with natural language instructions

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://python.org/) (v3.7 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- Google Gemini API key (free tier available)

## Installation

1. **Clone or download the project**

2. **Navigate to the project directory**
   ```bash
   cd Artifacts-AI-a-web-application-generator
   ```

3. **Create a virtual environment and install Python dependencies**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment (Windows)
   venv\Scripts\Activate.ps1
   
   # Install Python packages
   pip install -r requirements.txt
   ```

4. **Install Node.js dependencies**
   ```bash
   npm install
   ```

## Configuration

1. **Get Google Gemini API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Generative Language API
   - Create an API key under Credentials

2. **Configure Environment Variables**
   - Open the `.env` file in the project root
   - Replace `your_google_gemini_api_key_here` with your actual Google Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_google_gemini_api_key_here
     PORT=10000
     ```

## Usage

### 1. Start the Backend Server
Open a terminal in the project directory and run:
```bash
npm start
```
Or alternatively:
```bash
node server.js
```

### 2. Start the Frontend Application
In a separate terminal (with the Python virtual environment activated), run:
```bash
streamlit run app.py
```

### 3. Access the Application
- The Streamlit UI will be available at `http://localhost:8501` (or another port if 8501 is busy)
- You can now interact with the application

### 4. Generate Components
- Enter a description of the component you want to create in the text area
- Click "Generate" to create the React component
- The component will be displayed with a typing effect

### 5. Modify Components
- Enter modification instructions in the second text area
- Click "Modify" to update the existing component

### 6. Preview and Download
- Click "Website Preview" to see a live preview in CodeSandbox
- Click "Download" to get the complete React project as a ZIP file

## API Integration

The application uses Google's Gemini API for code generation:

- **Model**: `gemini-2.5-flash` (optimized for the free tier)
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent`
- **Authentication**: API key from environment variables
- **Request Format**: Uses the Gemini content format
- **Response Parsing**: Extracts generated code from candidates

## Project Structure

```
Artifacts-AI-a-web-application-generator/
├── app.py                 # Streamlit frontend application
├── server.js              # Express.js backend server
├── st_final.py            # Alternative Streamlit app
├── sandbox_creator.js     # CodeSandbox integration
├── clear.py               # Utility for cleaning generated code
├── test-gemini-api.js     # API testing script
├── list-models.js         # Model listing utility
├── package.json           # Node.js dependencies
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── .gitignore             # Git ignore rules
├── add.tsx                # Temporary storage for generated code
├── files/                 # React project template
│   ├── App.tsx           # Main React component
│   ├── index.tsx         # React entry point
│   ├── package.json      # React project dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   ├── styles.css        # Global styles
│   ├── components/       # Reusable UI components
│   │   └── ui/           # shadcn/ui components
│   └── lib/
│       └── utils.ts      # Utility functions
└── README.md             # This file
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify your Google Gemini API key is correct
   - Ensure the Generative Language API is enabled in Google Cloud Console
   - Check that billing is enabled on your Google Cloud project (even for free tier)

2. **Port Already in Use**
   - Change the PORT in `.env` file to an available port
   - Or kill the process using the port: `netstat -ano | findstr :10000` (Windows)

3. **Virtual Environment Activation**
   - On Windows PowerShell, you might need to run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - Then activate: `venv\Scripts\Activate.ps1`

4. **Dependency Installation Issues**
   - Update pip: `python -m pip install --upgrade pip`
   - Clear npm cache: `npm cache clean --force`

### Testing the API Connection

To test if the API connection works:
```bash
npm run test-gemini
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Ensure all dependencies are properly installed
3. Verify your API key is correctly configured
4. Open an issue in the repository if problems persist

## About Trikaal AI

This project is developed by **Trikaal AI**, an innovative tech startup specializing in AI-powered solutions and custom project development. We help businesses leverage artificial intelligence to solve complex challenges and accelerate growth.

### Our Services:
- **AI-Powered Solutions**: Custom AI implementations tailored to your business needs
- **Project Development**: Full-stack application development with cutting-edge technology
- **Consulting**: Expert guidance on AI integration and digital transformation
- **Custom Tools**: Bespoke software solutions for unique business requirements

### Why Choose Trikaal AI?
- Cutting-edge AI technology implementation
- Experienced team of developers and AI specialists
- End-to-end project management
- Focus on scalable and maintainable solutions
- Continuous support and maintenance

Visit us to explore how AI can transform your business and bring your ideas to life!

For inquiries: Contact us at brajesh@trikaal.org
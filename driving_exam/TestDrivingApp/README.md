# Driving Exam App

A Next.js application for practicing driving exam questions.

## Features

- Browse modules and topics
- Practice questions by topic
- Take random exams
- Save exam results (coming soon)
- Admin interface for adding content (coming soon)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for API calls

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API configuration:
   ```
   NEXT_PUBLIC_API_URL=your_api_url_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage (redirects to /modules)
│   ├── modules/           # Modules pages
│   ├── exam/             # Exam pages
│   ├── meine-pruefungen/  # Saved exams
│   └── admin/            # Admin interface
├── components/            # Reusable components
├── lib/                  # API and utilities
├── types/                # TypeScript types
└── styles/              # Global styles
```

## API Endpoints

- `GET /api/Modules` - Get all modules
- `GET /api/Topics?assignedModule=:moduleId` - Get topics for a module
- `GET /api/Questions?assignedTopic=:topicId` - Get questions for a topic
- `GET /api/exam/:moduleId?count=20` - Get random exam questions

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
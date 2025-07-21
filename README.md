# 🔥 FireCrawl News Monitor

A modern React + Next.js web application that uses FireCrawl to scrape and display the latest tech news from TechCrunch. Features real-time news fetching, intelligent categorization, and a beautiful Tailwind CSS interface.

## ✨ Features

- **Real-time News Scraping**: Powered by FireCrawl's intelligent web scraping API
- **Smart Categorization**: Automatically categorizes news into AI, Funding, Product, Regulation, or Other
- **Company Detection**: Identifies and highlights companies mentioned in headlines
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS
- **Error Handling**: Graceful fallbacks and error messages
- **Mock Data Fallback**: Demo data available when API is unavailable

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A FireCrawl API key (get one at [firecrawl.dev](https://firecrawl.dev))

### Installation

1. **Clone or download the project**
   ```bash
   git clone <your-repo-url>
   cd firecrawl-news-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "FIRECRAWL_API_KEY=your_firecrawl_api_key_here" > .env.local
   ```
   
   Replace `your_firecrawl_api_key_here` with your actual FireCrawl API key.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Add your `FIRECRAWL_API_KEY` environment variable in Vercel's dashboard
   - Deploy!

### Netlify

1. **Build the project**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Add environment variables in Netlify's dashboard

## 🔧 Configuration

### Environment Variables

- `FIRECRAWL_API_KEY`: Your FireCrawl API key (required)

### API Endpoints

- `POST /api/scrape`: Fetches and processes TechCrunch headlines

## 📁 Project Structure

```
firecrawl-news-monitor/
├── pages/
│   ├── api/
│   │   └── scrape.ts          # FireCrawl integration API route
│   ├── _app.tsx               # Next.js app configuration
│   └── index.tsx              # Main application component
├── styles/
│   └── globals.css            # Global styles with Tailwind
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🎨 Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **API Integration**: Axios for HTTP requests
- **Web Scraping**: FireCrawl API
- **Deployment**: Vercel/Netlify ready

## 🔄 How It Works

1. **User clicks "Fetch Latest News"**
2. **Frontend calls `/api/scrape` endpoint**
3. **Backend uses FireCrawl to scrape TechCrunch**
4. **AI-powered extraction identifies headlines, companies, and categories**
5. **Structured data is returned and displayed in beautiful cards**

## 🎯 Features in Detail

### Smart Categorization
The app automatically categorizes news articles into:
- **AI**: Artificial intelligence, machine learning, ChatGPT, etc.
- **Funding**: Investment rounds, venture capital, fundraising
- **Product**: Product launches, updates, new features
- **Regulation**: Government policy, legal issues, regulations
- **Other**: Everything else

### Company Detection
Automatically identifies and displays company names mentioned in headlines, including:
- Microsoft, Google, Apple, Amazon, Meta
- Tesla, OpenAI, Anthropic, SpaceX
- Uber, Airbnb, Netflix, and more

### Responsive Design
- Mobile-first design
- Clean, modern interface
- Smooth animations and transitions
- Accessible color schemes and typography

## 🛠️ Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Customization

#### Adding New Categories
Edit the category logic in `/pages/api/scrape.ts`:

```typescript
function categorizeHeadline(headline: string): Article['category'] {
  const lower = headline.toLowerCase();
  
  // Add your custom category logic here
  if (lower.includes('your-keyword')) {
    return 'YourCategory';
  }
  
  // ... existing logic
}
```

#### Styling Changes
Modify `/styles/globals.css` or `/tailwind.config.js` for custom styling.

## 🐛 Troubleshooting

### Common Issues

1. **"FireCrawl API key not configured"**
   - Make sure you've added `FIRECRAWL_API_KEY` to your `.env.local` file
   - Restart your development server after adding environment variables

2. **No articles showing**
   - Check your internet connection
   - Verify your FireCrawl API key is valid
   - The app will show mock data if the API fails

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Make sure you're using Node.js 18+

### Getting Help

- Check the [FireCrawl documentation](https://docs.firecrawl.dev)
- Review the Next.js documentation
- Open an issue in the project repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [FireCrawl](https://firecrawl.dev) - Web scraping API
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Vercel](https://vercel.com) - Deployment platform 
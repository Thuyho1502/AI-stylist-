# AI Fashion Stylist

An AI-powered personal styling web app that creates outfit recommendations based on occasion, weather, personal style, and the clothes you already own.

Instead of simply generating generic outfit ideas, AI Fashion Stylist uses a user's digital wardrobe as the foundation for its recommendations and allows outfits to be refined through natural-language feedback.

🔗 Live Demo: https://ai-stylist-xi.vercel.app 
📦 Repository: https://github.com/Thuyho1502/AI-stylist-

## Core Idea

Most AI styling tools start by inventing an outfit from scratch.

AI Fashion Stylist takes a different approach:

Start with what the user already owns, then fill the gaps when necessary.

The user provides context such as the occasion, weather, preferred style, and optional custom instructions. The system combines this context with the user's digital wardrobe to generate practical outfit recommendations.

## Features

- **AI Outfit Generation** — Generate three distinct outfit variations based on: occasion, personal style, weather,user preferences and existing wardrobe items.The generation system uses different styling directions for each variation to avoid producing three nearly identical outfits.

- ** Natural-Language Outfit Refinement ** — Users can refine an existing outfit without regenerating the entire recommendation. For example:"Replace the sweater with something lighter." The refinement endpoint preserves the parts of the outfit the user is happy with and changes only what was requested.

- **Wardrobe-Aware Suggestions** —The AI prioritizes items from the user's wardrobe instead of continuously inventing new clothing.
This makes the recommendations more practical and reduces unnecessary shopping suggestions.

- **Custom Styling Requests** — Users can provide additional natural-language instructions, for example: "Beach wedding, beige tones, prefer a skirt over pants."The request is incorporated into the outfit-generation process.

- **Digital Wardrobe** — Users can upload photos of their own clothes. AI automatically analyzes uploaded items and extracts information such as: Name, Category, Color and Material.This information is stored with the wardrobe item and can later be used during outfit generation.

- **AI Outfit Preview** — Users can generate a visual preview of an outfit on demand. When an outfit is refined, its previous preview is automatically invalidated to prevent the UI from displaying an image that no longer represents the current outfit.

- **Saved Outfits** — Users can: save outfits, favorite outfits, and revisit past outfit suggestions

- **Authentication** — Secure authentication with protected routes and user-specific data.Each user's wardrobe, outfits, and saved recommendations are isolated from other users.

## How It Work 
The application follows a multi-step workflow.

- 1. User provides styling context: The user selects or enters: Occasion, Weather, Personal style or Optional custom request.

- 2. Wardrobe is retrieved: The application retrieves the user's existing wardrobe items from PostgreSQL. Only the authenticated user's clothing data is available to the generation process.

- 3. AI generates outfit recommendations: The backend sends the styling context and relevant wardrobe data to the OpenAI API. Three outfit variations are generated with different styling directions to increase diversity. The system also applies validation rules to ensure that individual items are appropriate for the occasion and weather simultaneously.

- 4. User refines the result: The user can provide natural-language feedback about an existing outfit. Instead of regenerating everything, a dedicated refinement endpoint modifies the requested part while preserving the rest of the outfit.

- 5. User generates a visual preview: When the user wants to visualize an outfit, the application sends the selected outfit information to the image-generation model. The resulting image is stored and associated with the outfit.

- 6. Outfit is saved:  Users can save or favorite successful recommendations for later use.

## Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     Next.js UI      │
                         │    App Router       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
              Authentication    Wardrobe        Outfit UI
                    │               │               │
                    ▼               ▼               ▼
               NextAuth.js       API Routes      API Routes
                    │               │               │
                    └───────────────┼───────────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
                 OpenAI API      Prisma        Cloudflare R2
                     │              │
              ┌──────┴──────┐       ▼
              │             │   PostgreSQL
              ▼             ▼      (Neon)
          Text Model    Image Model

```

## Tech Stack

- **Frontend** : Next.js, React, TypeScript, Tailwind Css
- **Application** : Next.js App Router
- **Backend** : Next.js API Routes
- **ORM** : Prisma
- **Database** : PostgreSQL(Neon)
- **AI — Text** : OpenAI GPT-4o-mini
- **AI — Images** : OpenAI GPT Image 1 Mini
- **File Storage** :Cloudflare R2
- **Authentication** : NextAuth.js
- **Sessions** : JWT
- **Deployment** : Vercel


## Technical Challenges & Solutions

Building the application involved several problems beyond simply connecting an AI API.

**AI-generated outfits were too repetitive**: Multiple requests with the same occasion, style, and weather could produce nearly identical outfits.
Solution: Each generation request receives a different styling direction, including a color direction and creative constraint. I also tuned frequency_penalty and presence_penalty to encourage greater variation.
This changed the approach from simply generating three outfits to generating three outfits under deliberately different creative constraints.

**Individual items were valid, but the outfit was inconsistent**:The model could generate items that were individually appropriate but incompatible when combined — for example, formal clothing with casual footwear or a heavy sweater in hot weather.
Solution: I added explicit cross-validation rules to the system prompt. Each item must be compatible with the occasion, weather, and overall outfit rather than evaluating each factor independently.

**Outfit refinement needed to be surgical** Regenerating an entire outfit when the user only wanted to change one item was wasteful and could remove parts they already liked.
Solution: I created a dedicated refinement endpoint that receives the existing outfit and the user's feedback. The model modifies only the requested part while preserving the rest whenever possible.
When an outfit is refined, its existing preview image is also invalidated because it no longer represents the current outfit.

**Production behavior differed from local development.** Some issues only appeared after deploying to Vercel, including stale Prisma Client generation caused by build/dependency caching and environment variables containing surrounding quotes.
Solution: I used Vercel runtime logs to trace production 500 errors to their actual causes and updated the build configuration to ensure Prisma Client is generated during deployment.
This reinforced an important lesson: a successful local build does not necessarily mean the application is production-ready

## Getting Started


1. Prerequisites:  Make sure you have:
Node.js
npm
PostgreSQL database
OpenAI API key
Cloudflare R2 bucket

2. Clone the repo and install dependencies:
```bash
    git clone https://github.com/Thuyho1502/AI-stylist-.git
    cd AI-stylist-
    npm install
```
3. Configure environment variables: Create a .env.local file and add the required variables.
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=
OPENAI_API_KEY=
4. Run database migrations:
```bash
   npx prisma migrate dev
```
5. Start the dev server:
```bash
   npm run dev
```
The application will be available at: http://localhost:3000

## Environment Variables


| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret used to sign authentication tokens |
| `NEXTAUTH_URL` | Application URL |
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | Public URL for stored assets |
| `OPENAI_API_KEY` | OpenAI API key |


## Roadmap

**Planned**
 - UI redesign for a more distinctive visual identity
 - Body profile input
 - Body-shape-aware styling recommendations
 - Drag-and-drop outfit builder from the digital wardrobe
**Future**
 - AI-generated proportion illustrations
 - Photo-based virtual try-on
 - More advanced personalization based on previous outfit preferences
 - Improved wardrobe-to-outfit matching (including wardrobe context during refinement)

## What I Learned
This project started as an experiment with AI-generated fashion recommendations, but evolved into a more complete product involving:

- AI prompt engineering
- Structured AI outputs
- AI image generation
- Context-aware recommendations
- Natural-language refinement
- Database design
- File storage
- Authentication
- API design
- Production deployment
- Debugging server-side issues

The most important lesson was that building an AI application is not just about calling a model.

The application needs to constrain, validate, persist, refine, and present AI output in a way that makes the result useful to the user.

## Project Status
- Active development
The core styling, wardrobe, refinement, authentication, and image-generation workflows are implemented. The UI and personalization system are still being improved.
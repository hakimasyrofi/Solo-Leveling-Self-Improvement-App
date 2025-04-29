# Solo Leveling - Self-Improvement App

_A gamified self-improvement application inspired by the "Solo Leveling" manhwa/anime_

## Overview

Solo Leveling - Self-Improvement App is a gamified self-improvement application that transforms personal development into an immersive RPG experience. Set in a dark fantasy world, users can create custom quests, engage in combat, earn rewards, and level up their character as they achieve real-life goals.

The application uses a character-based progression system where completing tasks and defeating enemies rewards you with experience points, stat points, gold, and items, creating a rewarding feedback loop for self-improvement activities.

## Features

### Character Development System

- **Character Stats**: Build your character with 5 core stats (Strength, Vitality, Agility, Intelligence, Perception)
- **Level Progression**: Gain XP from completing quests and combat to level up
- **Class & Title System**: Unlock titles and job classes as you progress
- **Real-time Stats Visualization**: View your character's attributes and progress on a responsive dashboard

### Quest Management

- **Custom Quest Creation**: Create personalized quests tied to real-life goals
- **Difficulty Levels**: Set quest difficulty (E to S rank) with corresponding rewards
- **Quest Tracking**: Monitor progress on active quests
- **Rewards System**: Earn XP, stat points, gold, and items for completing quests
- **Time-based Quests**: Set expiry dates for time-sensitive goals

### Combat System

- **Enemy Selection**: Choose from various enemies with unique stats and rewards
- **Turn-based Combat**: Engage in strategic turn-based battles
- **Combat Visualization**: Interactive visual representation of battles
- **Combat Log**: Track actions and results in real-time
- **Skill System**: Unlock and use special abilities based on your stats
- **Item Usage**: Utilize consumable items during combat
- **Difficulty Filtering**: Filter enemies by difficulty level
- **Loot System**: Earn gold, items, and XP from victorious battles

### Inventory & Equipment

- **Item Management**: Collect and manage various items in your inventory
- **Equipment System**: Equip items to boost your stats
- **Item Rarity**: Items with different rarity levels (Common to Legendary)
- **Set Bonuses**: Collect and equip item sets for special bonuses
- **Consumable Items**: Use potions and other consumables during combat

### User Interface

- **Dark Fantasy Theme**: Immersive UI with a dark fantasy aesthetic
- **Responsive Design**: Fully responsive across desktop and mobile devices
- **Animated Components**: Smooth animations for level-ups, combat, and more
- **Mobile Navigation**: Dedicated mobile navigation for on-the-go tracking
- **Modal Dialogs**: Interactive modals for various game mechanics

### Data Management

- **Local Storage**: All progress is saved locally in the browser
- **Persistent State**: Your character's progress persists between sessions

## Tech Stack

### Frontend Framework

- **Next.js 15.2.4**: React framework for server-rendered applications
- **React 19.0.0**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for improved developer experience

### UI Libraries & Components

- **Radix UI**: Headless UI components for building accessible interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Shadcn/ui**: Component library built on Radix UI
- **Class Variance Authority**: Build UI component variants with TypeScript

### State Management

- **React Context API**: For global state management
- **useState/useEffect**: For component-level state management
- **Custom Hooks**: Purpose-built hooks for reusable logic

### Animation & Visualization

- **Canvas API**: For combat visualizations
- **CSS Animations**: For UI effects and transitions
- **Recharts**: For stats visualization

### Form Management

- **React Hook Form**: Form validation and management

### Development Tools

- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS compatibility

### Deployment

- **Vercel**: Cloud hosting platform for the application

## Getting Started

1. Clone the repository
2. Install dependencies with `pnpm install`
3. Run the development server with `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Game Mechanics

### Stats System

- **STR (Strength)**: Determines physical damage and carrying capacity
- **VIT (Vitality)**: Affects maximum HP and physical defense
- **AGI (Agility)**: Impacts speed, critical hit chance, and evasion
- **INT (Intelligence)**: Determines magic power and maximum MP
- **PER (Perception)**: Affects accuracy and item discovery

### Combat Flow

1. **Select an Enemy**: Choose an opponent from the Combat Arena
2. **Turn-based Combat**: Alternate turns between player and enemy
3. **Action Options**: Attack, Defend, Use Skills, Use Items, or Flee
4. **Victory Conditions**: Reduce enemy HP to zero
5. **Defeat Conditions**: Player HP reduced to zero (lose gold, but not permadeath)
6. **Rewards**: Collect experience, gold, and items upon victory

### Level Progression

- **Experience Points**: Gained from completing quests and winning battles
- **Level Up**: Automatically gain stat points when leveling up
- **Stat Allocation**: Spend stat points to increase specific attributes
- **Derived Stats**: HP, MP, and other attributes are calculated from base stats

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the "Solo Leveling" manhwa by Chugong
- Built with [v0.dev](https://v0.dev)
- Deployed on [Vercel](https://vercel.com)

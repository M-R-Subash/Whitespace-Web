# 🎨 Advanced Whiteboard App

A sophisticated, feature-rich whiteboard application built with modern web technologies. This project demonstrates advanced frontend development skills with complex canvas manipulation, state management, and real-time user interactions.

![Whiteboard Demo](https://img.shields.io/badge/Demo-Live-green) ![React](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-4.4-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3-cyan)

## ✨ Features

### 🖊️ Drawing Tools
- **Freehand Drawing** - Smooth pen tool with adjustable brush sizes
- **Shape Tools** - Rectangle, Circle, and Line tools with preview
- **Eraser** - Intelligent erasing with proper canvas composition
- **Color Picker** - Extensive color palette with custom color support
- **Brush Sizes** - Multiple preset sizes with live preview

### ⚡ Advanced Functionality
- **Undo/Redo** - Full history tracking with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Export/Import** - Save your artwork as PNG or import images
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Optimized Performance** - Batched rendering and efficient state updates

### 🎯 User Experience
- **Real-time Preview** - Visual feedback for all drawing operations
- **Keyboard Shortcuts** - Productivity-focused keyboard controls
- **Tool Indicators** - Clear visual feedback for current tool and settings
- **Smooth Animations** - Polished transitions and interactions

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2 with Hooks
- **Build Tool**: Vite 4.4 (Fast development and optimized builds)
- **Styling**: Tailwind CSS 3.3 (Utility-first CSS framework)
- **Icons**: Lucide React (Beautiful & consistent icons)
- **State Management**: Context API + useReducer
- **Canvas API**: Native HTML5 Canvas with advanced drawing algorithms

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/advanced-whiteboard.git
   cd advanced-whiteboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Whiteboard/          # Canvas and drawing components
│   ├── Toolbar/            # Tool selection and controls
│   ├── UsersPanel/         # User management interface
│   └── Shared/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── contexts/               # React Context for state management
├── utils/                  # Utility functions and drawing algorithms
└── App.jsx                 # Main application component
```

## 🎮 How to Use

### Basic Drawing
1. Select the **Pen tool** from the toolbar
2. Choose your preferred color and brush size
3. Click and drag on the canvas to draw

### Creating Shapes
1. Select **Rectangle**, **Circle**, or **Line** tool
2. Click and drag to define the shape size
3. Release to finalize the shape

### Advanced Features
- **Undo/Redo**: Use `Ctrl+Z` and `Ctrl+Y` or click the toolbar buttons
- **Export**: Click the download button to save as PNG
- **Clear**: Use the clear button to start fresh
- **Eraser**: Select eraser and drag over areas to remove

## 🔧 Technical Highlights

### Advanced State Management
```javascript
// Complex state handling with useReducer
const [state, dispatch] = useReducer(whiteboardReducer, initialState);
```

### Custom Hooks
- `useDrawing` - Canvas drawing logic and event handling
- `useUndoRedo` - History management with batch updates
- `useLocalStorage` - Persistent user preferences

### Performance Optimizations
- Batched drawing updates to prevent excessive re-renders
- Efficient canvas redrawing algorithms
- Optimized event handlers with proper cleanup

### Canvas Manipulation
```javascript
// Advanced drawing utilities
DrawingUtils.drawLine(ctx, start, end, color, brushSize);
DrawingUtils.smoothPoints(points); // Bezier curve smoothing
```

## 🎨 Customization

### Adding New Tools
1. Extend the `tools` array in `Toolbar.jsx`
2. Implement drawing logic in `drawingUtils.js`
3. Add tool-specific handling in `useDrawing` hook

### Styling
The project uses Tailwind CSS for styling. Customize the design by:
- Modifying `tailwind.config.js`
- Adding custom classes in components
- Extending the color palette

## 🤝 Contributing

This project was developed with AI assistance to demonstrate advanced frontend development capabilities. While this is primarily a portfolio piece, suggestions and improvements are welcome!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with **Vite** for lightning-fast development
- Styled with **Tailwind CSS** for rapid UI development
- Icons provided by **Lucide React**
- Developed as a showcase of modern React patterns and advanced frontend techniques

---

**⭐ Star this repo if you found it helpful for your frontend development journey!**

---

*This project demonstrates that complex, interactive applications can be built entirely with frontend technologies, showcasing the power of modern web development.*
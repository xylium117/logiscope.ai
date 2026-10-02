import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LatexMathProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const LatexMath: React.FC<LatexMathProps> = ({
  math,
  displayMode = false,
  className = '',
}) => {
  try {
    const html = katex.renderToString(math, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml',
      strict: false,
    });

    return (
      <span
        className={`katex-math-wrapper ${displayMode ? 'block my-2 text-center overflow-x-auto py-1' : 'inline-block px-1'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return (
      <code className={`font-mono text-cyan-300 text-xs ${className}`}>
        {math}
      </code>
    );
  }
};

export default LatexMath;

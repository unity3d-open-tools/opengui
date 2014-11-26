using UnityEngine;
using System.Collections;

// Label info
public class OGTextInfo {
	public class LineInfo {
		public int start;
		public int end;
		public float width;
		public float height;
		public OGCharacterInfo[] chars = new OGCharacterInfo [ 999 ];

		private int cIndex = 0;

		public int length {
			get {
				return end - start;
			}
		}

		public LineInfo ( int s, float h ) {
			start = s;
			height = h;
			cIndex = 0;
		}

		public void End ( int e ) {
			end = e;
			cIndex = 0;
		}

		public void AddChar ( OGCharacterInfo info ) {
			chars[cIndex] = info;
			cIndex++;
		}
	}

	public LineInfo[] lines = new LineInfo [ 999 ];
	public float height;
	public float width;
	public float lineHeight;
	public int length = 0;

	private int lIndex = 0;

	private LineInfo NewLine ( int i ) {
		if ( lIndex >= 999 ) {
			lIndex = 0;
		}
		
		LineInfo newLine = new LineInfo ( i, lineHeight );
		lines[lIndex] = ( newLine );
		height += lineHeight;
		lIndex++;
		return newLine;
	}

	public void Calculate ( string str, OGTextStyle style, float size, Rect rect ) {
		lineHeight = style.font.info.lineSpacing * size;

		LineInfo line = NewLine ( 0 );
		int lastSpace = 0;
		float lineWidthAtLastSpace = 0;
		float space = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		float right = rect.width - style.padding.right - style.padding.left;
		
		int c = 0;

		for ( c = 0; c < str.Length; c++ ) {
			OGCharacterInfo info = style.font.GetCharacterInfo ( str[c] );
			
			// This character is a carriage return	
			if ( str[c] == "\n"[0] ) {
				line.End ( c );
				line = NewLine ( line.end );
			
			// This character is a space
			} else if ( info.space ) {
				line.width += space;
				lastSpace = c;
				
				// The line width has exceeded the border
				if ( line.width >= right ) {
					line.width = lineWidthAtLastSpace;
					c = lastSpace == 0 ? lastSpace : c;
					line.End ( c - 1 );
					line = NewLine ( c + 1 );
				
				} else {
					lineWidthAtLastSpace = line.width - space;
					line.AddChar ( info );

				}
			
			// This character is a regular glyph
			} else {
				line.width += info.width * size;
			
				// The line width has exceeded the border
				if ( line.width >= right ) {
					line.width = lineWidthAtLastSpace;
					c = lastSpace == 0 ? lastSpace : c;
					line.End ( c - 1 );
					line = NewLine ( c + 1 );
				
				} else {
					line.AddChar ( info );

				}
			}
		}
		
		line.End ( c );

		length = lIndex;

		lIndex = 0;
	}
}


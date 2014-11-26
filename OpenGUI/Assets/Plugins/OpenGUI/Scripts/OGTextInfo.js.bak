#pragma strict

// Label info
public class OGTextInfo {
	public class LineInfo {
		public var start : int;
		public var end : int;
		public var width : float;
		public var height : float;
		public var chars : OGCharacterInfo [] = new OGCharacterInfo [ 999 ];

		private var cIndex : int = 0;

		public function get length () : int {
			return end - start;
		}

		function LineInfo ( s : int, h : float ) {
			start = s;
			height = h;
			cIndex = 0;
		}

		public function End ( e : int ) {
			end = e;
			cIndex = 0;
		}

		public function AddChar ( info : OGCharacterInfo ) {
			chars[cIndex] = info;
			cIndex++;
		}
	}

	public var lines : LineInfo [] = new LineInfo [ 999 ];
	public var height : float;
	public var width : float;
	public var lineHeight : float;
	public var length : int = 0;

	private var lIndex : int = 0;

	private function NewLine ( i : int ) : LineInfo {
		if ( lIndex >= 999 ) {
			lIndex = 0;
		}
		
		var newLine : LineInfo = new LineInfo ( i, lineHeight );
		lines[lIndex] = ( newLine );
		height += lineHeight;
		lIndex++;
		return newLine;
	}

	public function Calculate ( string : String, style : OGTextStyle, size : float, rect : Rect ) {
		lineHeight = style.font.info.lineSpacing * size;

		var line : LineInfo = NewLine ( 0 );
		var lastSpace : int;
		var lineWidthAtLastSpace : float = 0;
		var space : float = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		var right : float = rect.width - style.padding.right - style.padding.left;
		var bottom : float = style.padding.bottom;
		
		for ( var c : int = 0; c < string.Length; c++ ) {
			var info : OGCharacterInfo = style.font.GetCharacterInfo ( string[c] );
			
			// This character is a carriage return	
			if ( string[c] == "\n"[0] ) {
				line.End ( c );
				line = NewLine ( line.end );
			
			// This character is a space
			} else if ( info.space ) {
				line.width += space;
				lastSpace = c;
				
				// The line width has exceeded the border
				if ( line.width >= right ) {
					line.width = lineWidthAtLastSpace;
					c = lastSpace == 0 ? c : lastSpace;
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
					c = lastSpace == 0 ? c : lastSpace;
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


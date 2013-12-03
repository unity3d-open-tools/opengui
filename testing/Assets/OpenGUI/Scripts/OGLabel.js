#pragma strict

public class OGLabel extends OGWidget {
	public class Glyph {
		public var info : CharacterInfo;
		public var uv : Vector2[];
		public var relativeSize : float;
		public var vert : Rect;
		public var fontOffset : Vector2;
		public var width : float;
		public var position : Vector2;	

		function Glyph ( info : CharacterInfo, relativeSize : float ) {
			this.info = info;
			this.relativeSize = relativeSize;
			uv = new Vector2[4];
			vert = new Rect ( ( info.vert.x / Screen.width ) * relativeSize, ( info.vert.y / Screen.height ) * relativeSize, ( info.vert.width / Screen.width ) * relativeSize, ( info.vert.height / Screen.height ) * relativeSize );
			width = ( ( info.width + 1 ) * relativeSize ) / Screen.width;
			position.y = vert.height + vert.y;

			if ( info.flipped ) {
				uv[0] = new Vector2 ( info.uv.x, info.uv.y + info.uv.height );
				uv[1] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y + info.uv.height );
				uv[2] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y );
				uv[3] = new Vector2 ( info.uv.x, info.uv.y );
			} else {
				uv[0] = new Vector2 ( info.uv.x, info.uv.y );
				uv[1] = new Vector2 ( info.uv.x, info.uv.y + info.uv.height );
				uv[2] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y + info.uv.height );
				uv[3] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y );
			}		
		}

		public function Draw ( x : float, y : float, z : float ) {
			// Bottom Left
			GL.TexCoord2 ( uv[0].x, uv[0].y );
			GL.Vertex3 ( position.x + x, position.y + y, z );
			
			// Top left
			GL.TexCoord2 ( uv[1].x, uv[1].y );
			GL.Vertex3 ( position.x + x, position.y + y - vert.height, z );
			
			// Top right
			GL.TexCoord2 ( uv[2].x, uv[2].y );
			GL.Vertex3 ( position.x + x + vert.width, position.y + y - vert.height, z );
		
			// Bottom right
			GL.TexCoord2 ( uv[3].x, uv[3].y );
			GL.Vertex3 ( position.x + x + vert.width, position.y + y, z );
		}
	}
	
	public class Word {
		public var glyphs : List.< Glyph >;
		public var width : float;
		public var position : Vector2;

		function Word () {
			glyphs = new List.< Glyph > ();
		}

		public function Add ( glyph : Glyph ) {
			glyphs.Add ( glyph );
			glyph.position.x = width;
			width += glyph.width;
		}	

		public function Draw ( x : float, y : float, z : float ) {
			for ( var g : Glyph in glyphs ) {
				g.Draw ( position.x + x, position.y + y, z );
			}
		}
	}

	public class Line {
		public var words : List.< Word >;
		public var width : float;	
		public var position : Vector2;

		function Line () {
			words = new List.< Word > ();
		}

		public function Add ( word : Word, spacing : float ) {
			words.Add ( word );
			word.position.x = width + spacing;
			width += word.width + spacing;
		}

		public function Draw ( x : float, y : float, z : float ) {
			for ( var w : Word in words ) {
				w.Draw ( position.x + x, position.y + y, z );
			}
		}
	}

	public var text : String;
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;

	@HideInInspector public var textStyle : GUIStyle = new GUIStyle();

	private var drawLines : Line[];
	private var lineHeight : float;
	private var spacing : float;
	

	/////////////////
	// Update
	/////////////////
	override function UpdateWidget () {
		if ( root == null || root.skin == null ) { return; }		

		if ( !overrideFontSize && style != null ) {
			fontSize = style.text.fontSize;
		}

		if ( !overrideAlignment && style != null ) {
			alignment = style.text.alignment;
		}

		var characterInfo : CharacterInfo[] = root.skin.fonts [ style.text.fontIndex ].characterInfo;
		var unicodeDictionary : Dictionary.< int, int > = root.unicode [ style.text.fontIndex ];

		var tallestGlyph : float = 0;
		var widestGlyph : float = 0;
		var lineCount : int = 0;

		var lineList : List.< Line > = new List.< Line >();	
		var wordList : List.< Word > = new List.< Word >();
		var strings : String[] = text.Split ( " "[0] );

		lineList.Add ( new Line () );

		for ( var s : int = 0; s < strings.Length; s++ ) {
			var word : Word = new Word ();
			
			for ( var i : int = 0; i < strings[s].Length; i++ ) {
				var unicodeIndex : int = strings[s][i];
				
				if ( unicodeDictionary.ContainsKey ( unicodeIndex ) ) {
					var glyph : Glyph = new Glyph ( characterInfo [ unicodeDictionary [ unicodeIndex ] ], fontSize / 72.0 );

					if ( -glyph.info.vert.height * glyph.relativeSize > tallestGlyph ) {
						tallestGlyph = -glyph.info.vert.height * glyph.relativeSize;
					}

					if ( glyph.info.vert.width * glyph.relativeSize > widestGlyph ) {
						widestGlyph = glyph.info.vert.width * glyph.relativeSize;
					}

					word.Add ( glyph );
				}
			}

			if ( lineList[lineCount].width + word.width + spacing > drawRct.width - style.text.padding.left / Screen.width ) {
				lineCount++;
				lineList.Add ( new Line () );
			}

			lineList[lineCount].Add ( word, spacing );
		
		}

		lineHeight = ( tallestGlyph * style.text.lineHeight ) / Screen.height;
		spacing = ( widestGlyph / 2 * style.text.spacing ) / Screen.width;		

		drawLines = lineList.ToArray ();
		
		for ( var l : int = 0; l < drawLines.Length; l++ ) {
			// Position
			var x : float = drawRct.x;
			var y : float = drawRct.y + drawRct.height;
			var leftPadding : float = style.text.padding.left * 1.0 / Screen.width;
			var rightPadding : float = style.text.padding.right * 1.0 / Screen.width;
			var topPadding : float = style.text.padding.top * 1.0 / Screen.height;
			var bottomPadding : float = style.text.padding.bottom * 1.0 / Screen.height;				
			var line : Line = drawLines[l];

			// Calculate offset for alignment
			switch ( alignment ) {
				case TextAnchor.UpperLeft:
					x += leftPadding;
					y -= topPadding; 
					break;

				case TextAnchor.MiddleLeft:
					x += leftPadding;
					y -= drawRct.height / 2 - ( lineHeight / 2 ) * drawLines.Length; 
					break;

				case TextAnchor.LowerLeft:
					x += leftPadding;
					y -= drawRct.height - bottomPadding - lineHeight * drawLines.Length;
					break;

				case TextAnchor.UpperCenter:
					x += drawRct.width / 2 - line.width / 2;
					y -= topPadding; 
					break;

				case TextAnchor.MiddleCenter:
					x += drawRct.width / 2 - line.width / 2;
					y -= drawRct.height / 2 - ( lineHeight / 2 ) * ( drawLines.Length ); 
					break;

				case TextAnchor.LowerCenter:
					x += drawRct.width / 2 - line.width / 2;
					y -= drawRct.height - bottomPadding - lineHeight * drawLines.Length;
					break;

				case TextAnchor.UpperRight:
					x += drawRct.width - line.width;
					y -= topPadding; 
					break;

				case TextAnchor.MiddleRight:
					x += drawRct.width - line.width;
					y -= drawRct.height / 2 - ( lineHeight / 2 ) * ( drawLines.Length ); 
					break;

				case TextAnchor.LowerRight:
					x += drawRct.width - line.width;
					y -= drawRct.height - bottomPadding - lineHeight * drawLines.Length;
					break;
			}

			line.position.x = x;
			if ( l > 0 ) {
				line.position.y = drawLines[l-1].position.y - lineHeight;
			} else {
				line.position.y = y;
			}
		}
	}
	

	//////////////////
	// Draw
	//////////////////	
	private function DrawLines ( shadowOffset : float ) {
		for ( var line : Line in drawLines ) {	
			line.Draw ( shadowOffset, shadowOffset, drawDepth );
		}
	}
			
	override function DrawGL () {
		if ( drawRct == null || drawLines == null ) { return; }
		
		if ( style.text.shadowSize > 0 ) {
			GL.Color ( style.text.shadowColor );
			DrawLines ( style.text.shadowSize );
		}	
	
		GL.Color ( style.text.fontColor );
		
		DrawLines ( 0 );

		GL.Color ( Color.white );
	}
}

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
			vert = new Rect ( info.vert.x * relativeSize, info.vert.y * relativeSize, info.vert.width * relativeSize, info.vert.height * relativeSize );
			width = ( ( info.width + 1 ) * relativeSize );
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

		public function Draw ( x : float, y : float, z : float, clipRct : Rect ) {
			var shouldClip : boolean = clipRct.width > 0 && clipRct.height > 0;
			var shouldDraw : boolean = true;
			var mod : float = 0;
			var flex : float = 5;

			var left : float = position.x + x;
			var right : float = position.x + x + vert.width;
			var bottom : float = position.y + y;
			var top : float = position.y + y - vert.height;

			if ( shouldClip ) {
				mod = clipRct.x - left - flex;
				if ( mod > vert.width ) {
					shouldDraw = false;
				} else if ( mod > 0 ) {
					left += mod;
				}
				
				mod = right - (clipRct.x+clipRct.width) - flex;
				if ( mod > vert.width ) {
					shouldDraw = false;
				} else if ( mod > 0 ) {
					right -= mod;
				}

				mod = clipRct.y - bottom - flex;
				if ( mod > vert.height ) {
					shouldDraw = false;
				} else if ( mod > 0 ) {
					bottom += mod;
				}

				mod = top - (clipRct.y+clipRct.height) - flex;
				if ( mod > vert.height ) {
					shouldDraw = false;
				} else if ( mod > 0 ) {
					top -= mod;
				}
			}
			
			if ( shouldDraw ) {
				// Bottom Left
				GL.TexCoord2 ( uv[0].x, uv[0].y );
				GL.Vertex3 ( left, bottom, z );
				
				// Top left
				GL.TexCoord2 ( uv[1].x, uv[1].y );
				GL.Vertex3 ( left, top, z );

				// Top right
				GL.TexCoord2 ( uv[2].x, uv[2].y );
				GL.Vertex3 ( right, top, z );
			
				// Bottom right
				GL.TexCoord2 ( uv[3].x, uv[3].y );
				GL.Vertex3 ( right, bottom, z );
			}
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

		public function Draw ( x : float, y : float, z : float, clipRct : Rect ) {
			for ( var i : int = 0; i < glyphs.Count; i++ ) {
				glyphs[i].Draw ( position.x + x, position.y + y, z, clipRct );
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

		public function Draw ( x : float, y : float, z : float, clipRct : Rect ) {
			for ( var i : int = 0; i < words.Count; i++ ) {
				words[i].Draw ( position.x + x, position.y + y, z, clipRct );
			}
		}
	}

	public var text : String = "";
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;

	@HideInInspector public var lineWidth : float = 0;
	@HideInInspector public var drawLines : Line[];
	
	private var lineHeight : float;
	private var spacing : float;
	private var oldString : String = "";


	/////////////////
	// Update
	/////////////////
	override function UpdateWidget () {
		if ( styles.basic == null ) { return; }

		if ( !overrideFontSize ) {
			fontSize = styles.basic.text.fontSize;
		}

		if ( !overrideAlignment ) {
			alignment = styles.basic.text.alignment;
		}

		var characterInfo : CharacterInfo[] = root.skin.fonts [ styles.basic.text.fontIndex ].characterInfo;
		var unicodeDictionary : Dictionary.< int, int > = root.GetUnicode ( styles.basic.text.fontIndex );

		var tallestGlyph : float = 0;
		var widestGlyph : float = 0;
		var lineCount : int = 0;
		var widestLine : float = 0;

		var lineList : List.< Line > = new List.< Line >();	
		var displayedText = text.Replace ( "\n", " \n" );
		var strings : String[] = displayedText.Split ( " "[0] );

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

			if ( styles.basic.text.wordWrap ) {
				 if ( lineList[lineCount].width + word.width + spacing > drawRct.width - styles.basic.text.padding.left ) {
					lineCount++;
					lineList.Add ( new Line () );
				 }
			}

			if ( strings[s].Contains ( "\n" ) ) {
				lineCount++;
				lineList.Add ( new Line () );
			}

			lineList[lineCount].Add ( word, spacing );
			
			if ( widestLine < lineList[lineCount].width ) {
				widestLine = lineList[lineCount].width;
			}
		}

		lineWidth = widestLine;
		lineHeight = styles.basic.text.fontSize * styles.basic.text.lineHeight;
		spacing = widestGlyph / 2 * styles.basic.text.spacing;		

		drawLines = lineList.ToArray ();
		
		for ( var l : int = 0; l < drawLines.Length; l++ ) {
			// Position
			var x : float = 0;
			var y : float = 0;
			var leftPadding : float = styles.basic.text.padding.left;
			var rightPadding : float = styles.basic.text.padding.right;
			var topPadding : float = styles.basic.text.padding.top;
			var bottomPadding : float = styles.basic.text.padding.bottom;				
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
		
		mouseRct = drawRct;
		
	}
	

	//////////////////
	// Draw
	//////////////////	
	private function DrawLines ( shadowOffset : float ) {
		for ( var i : int = 0; i < drawLines.Length; i++ ) {	
			drawLines[i].Draw ( drawRct.x + shadowOffset, drawRct.y + drawRct.height + shadowOffset, drawDepth, clipRct );
		}
	}
			
	override function DrawGL () {
		if ( drawRct == null || drawLines == null ) { return; }
		
		/*
		if ( styles.basic.text.shadowSize > 0 ) {
			GL.Color ( styles.basic.text.shadowColor );
			DrawLines ( styles.basic.text.shadowSize );
		}*/	
	
		GL.Color ( styles.basic.text.fontColor );
		
		DrawLines ( 0 );

		GL.Color ( Color.white );
	}
}

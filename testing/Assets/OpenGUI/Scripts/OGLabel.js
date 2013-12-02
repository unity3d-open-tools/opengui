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
	}

	public var text : String;
	public var overrideFontSize : boolean = false;
	public var fontSize : int;
	public var overrideAlignment : boolean = false;
	public var alignment : TextAnchor;

	@HideInInspector public var textStyle : GUIStyle = new GUIStyle();

	private var drawCharacters : Glyph[];
	private var drawWords : Word[];
	private var lineHeight : float;
/*
	private function CalcFontOffset ( vert : Rect ) : Vector2 {
		var o : Vector2 = Vector2.zero;
		var xMin : float = ( style.text.padding.left * 1.0 ) / Screen.width;
		var xMid : float = drawRct.width / 2 + vert.x + vert.width;
		var xMax : float = drawRct.width + vert.x + vert.width - ( labelSize.x + ( style.text.padding.right * 1.0 ) ) / Screen.width;
		var yMin : float = drawRct.height + vert.y + vert.height - ( style.text.padding.top * 1.0 ) / Screen.height;
		var yMid : float = drawRct.height / 2 + vert.y + vert.height + ( labelSize.y / 2 ) / Screen.height + lineHeight / 2;
		var yMax : float = ( style.text.padding.bottom * 1.0 ) / Screen.height;
		
		switch ( alignment ) {
			case TextAnchor.UpperLeft:
				o.x = xMin; 
				o.y = yMin;
				break;
			
			case TextAnchor.UpperCenter:
				o.x = xMid; 
				o.y = yMin; 
				break;
			
			case TextAnchor.UpperRight:
				o.x = xMax; 
				o.y = yMin; 
				break;
			
			case TextAnchor.MiddleRight:
				o.x = xMax; 
				o.y = yMid; 
				break;
			
			case TextAnchor.MiddleCenter:
				o.x = xMid; 
				o.y = yMid; 
				break;

			case TextAnchor.LowerRight:
				o.x = xMax; 
				o.y = yMax; 
				break;
			
			case TextAnchor.LowerCenter:
				o.x = xMid; 
				o.y = yMax; 
				break;

			case TextAnchor.LowerLeft:
				o.x = xMin; 
				o.y = yMax; 
				break;

			case TextAnchor.MiddleLeft:
				o.x = xMin; 
				o.y = yMid; 
				break;	
				
		}
		
		return o;
	}
	
*/	
	/////////////////
	// Update
	/////////////////
	override function UpdateWidget ( root : OGRoot ) {
		if ( !overrideFontSize && style != null ) {
			fontSize = style.text.fontSize;
		}

		if ( !overrideAlignment && style != null ) {
			alignment = style.text.alignment;
		}

		var characterInfo : CharacterInfo[] = root.skin.fonts [ style.text.fontIndex ].characterInfo;
		var unicodeDictionary : Dictionary.< int, int > = root.unicode [ style.text.fontIndex ];

		var tallestGlyph : float = 0;
		var lines : int = 0;
		var wordAdvance : float = 0;
		
		var wordList : List.< Word > = new List.< Word >();
		var strings : String[] = text.Split ( " "[0] );

		for ( var s : int = 0; s < strings.Length; s++ ) {
			var word : Word = new Word ();
			
			for ( var i : int = 0; i < strings[s].Length; i++ ) {
				var unicodeIndex : int = strings[s][i];
				
				if ( unicodeDictionary.ContainsKey ( unicodeIndex ) ) {
					var glyph : Glyph = new Glyph ( characterInfo [ unicodeDictionary [ unicodeIndex ] ], fontSize / 72.0 );

					if ( glyph.info.vert.height * glyph.relativeSize < tallestGlyph ) {
						tallestGlyph = -glyph.info.vert.height * glyph.relativeSize;
					}

					word.Add ( glyph );
				}
			}

			if ( wordAdvance > drawRct.width ) {
				lines++;
				wordAdvance = 0;
			}

			word.position.x = wordAdvance;
			word.position.y = lines * lineHeight;
		}

		lineHeight = ( tallestGlyph * style.text.lineHeight ) / Screen.height;

		drawWords = wordList.ToArray ();
	}
	

	//////////////////
	// Draw
	//////////////////	
	private function DrawWords ( shadowOffset : float ) {
		for ( var word : Word in drawWords ) {
			for ( var glyph : Glyph in word.glyphs ) {
				// Bottom Left
				GL.TexCoord2 ( glyph.uv[0].x, glyph.uv[0].y );
				GL.Vertex3 ( drawRct.x + word.position.x + glyph.position.x + shadowOffset, drawRct.y + word.position.y + shadowOffset, drawDepth );
				
				// Top left
				GL.TexCoord2 ( glyph.uv[1].x, glyph.uv[1].y );
				GL.Vertex3 ( drawRct.x + word.position.x + glyph.position.x + shadowOffset, drawRct.y + word.position.y + glyph.vert.height + shadowOffset, drawDepth );
				
				// Top right
				GL.TexCoord2 ( glyph.uv[2].x, glyph.uv[2].y );
				GL.Vertex3 ( drawRct.x + word.position.x + glyph.position.x + shadowOffset + glyph.vert.width, drawRct.y + word.position.y + glyph.vert.height + shadowOffset, drawDepth );
			
				// Bottom right
				GL.TexCoord2 ( glyph.uv[3].x, glyph.uv[3].y );
				GL.Vertex3 ( drawRct.x + word.position.x + glyph.position.x + shadowOffset + glyph.vert.width, drawRct.y + word.position.y + shadowOffset, drawDepth );
			}
		}
	}
			
	override function DrawGL () {
		if ( drawRct == null || drawCharacters == null ) { return; }
		
		if ( style.text.shadowSize > 0 ) {
			GL.Color ( style.text.shadowColor );
			DrawWords ( style.text.shadowSize );
		}	
	
		GL.Color ( style.text.fontColor );
		
		DrawWords ( 0 );

		GL.Color ( Color.white );
	}
}

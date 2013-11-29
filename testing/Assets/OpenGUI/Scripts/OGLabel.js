#pragma strict

public class OGLabel extends OGWidget {
	private class Glyph {
		public var info : CharacterInfo;
		public var linebreak : boolean = false;
	}

	public var text : String;
	public var customFontSize : int;

	@HideInInspector public var labelSize : Vector2;	
	@HideInInspector public var textStyle : GUIStyle = new GUIStyle();
	
	private var alteredFontSize : int = 0;
	private var drawCharacters : Glyph[];

	private function CalcFontOffset ( vert : Rect ) : Vector2 {
		var o : Vector2 = Vector2.zero;
		
		switch ( style.text.alignment ) {
			case TextAnchor.MiddleCenter:
				o.x = ( ( drawRct.width + vert.x + vert.width ) / 2 ) - ( ( labelSize.x / 2 ) / Screen.width );
				o.y = ( drawRct.height + vert.y + vert.height ) / 2;
				break;

			case TextAnchor.MiddleLeft:
				o.x = ( style.text.padding.left * 1.0 ) / Screen.width;
				o.y = ( ( drawRct.height + vert.y + vert.height ) / 2 ) + ( ( labelSize.y / 2 ) / Screen.height );
				break;	
				
			case TextAnchor.UpperLeft:
				o.x = ( style.text.padding.left * 1.0 ) / Screen.width;
				o.y = drawRct.height + vert.y + vert.height;
				break;
		}
		
		return o;
	}
	
	
	/////////////////
	// Update
	/////////////////
	override function UpdateWidget ( root : OGRoot ) {
		if ( customFontSize > 5 ) {
			alteredFontSize = customFontSize;
		} else {
			alteredFontSize = style.text.fontSize;
		}

		var characterInfo : CharacterInfo[] = root.skin.fonts [ style.text.fontIndex ].characterInfo;
		var unicodeDictionary : Dictionary.< int, int > = root.unicode [ style.text.fontIndex ];
		
		drawCharacters = new Glyph [text.Length];
		
		for ( var i : int = 0; i < text.Length; i++ ) {
			var unicodeIndex : int = text[i];
			
			if ( unicodeDictionary.ContainsKey ( unicodeIndex ) ) {			
				var glyph : Glyph = new Glyph ();
				glyph.info = characterInfo [ unicodeDictionary [ unicodeIndex ] ];
				glyph.linebreak = false;
				
				drawCharacters[i] = glyph;
			}
		}
	}
	
	//////////////////
	// Draw
	//////////////////	
	private function DrawCharacters ( shadowOffset : boolean ) {
		var advance : float = 0;
		var tallestGlyph : float = 0;
		var lines : int = 1;

		for ( var i : int = 0; i < drawCharacters.Length; i++ ) {
			if ( drawCharacters[i] == null ) { continue; }

			var c : CharacterInfo = drawCharacters[i].info;
			var size : float = alteredFontSize / 48.0;
			var vert : Rect = new Rect ( (c.vert.x/Screen.width)*size, (c.vert.y/Screen.height)*size, (c.vert.width/Screen.width)*size, (c.vert.height/Screen.height)*size );
			var fontOffset : Vector2 = CalcFontOffset ( vert );
			var uvs : Vector2[] = new Vector2[4];

			if ( c.vert.height > tallestGlyph ) { tallestGlyph = c.vert.height; }

			if ( shadowOffset ) {
				fontOffset.x += style.text.shadowSize;
				fontOffset.y += style.text.shadowSize;
			}

			// Rotation
			if ( c.flipped ) {
				uvs[0] = new Vector2 ( c.uv.x, c.uv.y + c.uv.height );
				uvs[1] = new Vector2 ( c.uv.x + c.uv.width, c.uv.y + c.uv.height );
				uvs[2] = new Vector2 ( c.uv.x + c.uv.width, c.uv.y );
				uvs[3] = new Vector2 ( c.uv.x, c.uv.y );
			} else {
				uvs[0] = new Vector2 ( c.uv.x, c.uv.y );
				uvs[1] = new Vector2 ( c.uv.x, c.uv.y + c.uv.height );
				uvs[2] = new Vector2 ( c.uv.x + c.uv.width, c.uv.y + c.uv.height );
				uvs[3] = new Vector2 ( c.uv.x + c.uv.width, c.uv.y );
			}		
			
			// Bottom Left
			GL.TexCoord2 ( uvs[0].x, uvs[0].y );
			GL.Vertex3 ( fontOffset.x + drawRct.x + advance, fontOffset.y + drawRct.y, drawDepth );
			
			// Top left
			GL.TexCoord2 ( uvs[1].x, uvs[1].y );
			GL.Vertex3 ( fontOffset.x + drawRct.x + advance, fontOffset.y + drawRct.y - vert.height, drawDepth );
			
			// Top right
			GL.TexCoord2 ( uvs[2].x, uvs[2].y );
			GL.Vertex3 ( fontOffset.x + drawRct.x + advance + vert.width, fontOffset.y + drawRct.y - vert.height, drawDepth );
			// Bottom right
			GL.TexCoord2 ( uvs[3].x, uvs[3].y );
			GL.Vertex3 ( fontOffset.x + drawRct.x + advance + vert.width, fontOffset.y + drawRct.y, drawDepth );
		
			advance += ( (c.width+1) * size ) / Screen.width;
		}

		labelSize.x = advance * Screen.width;
		labelSize.y = tallestGlyph * lines;
	}
			
	override function DrawGL () {
		if ( drawRct == null || drawCharacters == null ) { return; }
		
		if ( style.text.shadowSize > 0 ) {
			GL.Color ( style.text.shadowColor );
			DrawCharacters ( true );
		}	
	
		GL.Color ( style.text.fontColor );
		
		DrawCharacters ( false );

		GL.Color ( Color.white );
	}
}

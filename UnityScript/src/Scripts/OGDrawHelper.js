#pragma strict

import System.Collections.Generic;

public class OGDrawHelper {
	private static var texSize : Vector2;
	
	//////////////////
	// Core
	//////////////////
	// Pass
	public static function SetPass ( mat : Material ) {
		mat.SetPass ( 0 );
		texSize.x = mat.mainTexture.width;
		texSize.y = mat.mainTexture.height;
	}


	//////////////////
	// Label
	//////////////////
	// Draw
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth );
	}
	
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, intSize : int, alignment : TextAnchor, depth : float ) {
		if ( style.font == null ) {
			return;
		}
		
		var lines : String[] = string.Split ( "\n"[0] );
		var size : float = ( intSize * 1.0 ) / 72;
		var advance : Vector2;
		var left : float = style.padding.left;
		var right : float = rect.width - style.padding.right;
		var top : float = rect.height - style.padding.top;
		var middle : float = ( rect.height / 2 ) + ( lines.Length * ( intSize * style.lineHeight ) ) / 2;
		var center : float = rect.width / 2;
		var bottom : float = lines.Length * ( intSize * style.lineHeight ) + style.padding.bottom;
		var anchor : Vector2;
		var space : float = ( intSize / 4 ) * style.spacing;
		var glyphs : Queue.< CharacterInfo > = new Queue.< CharacterInfo >();
		var thisLineEnd : int = 0;
		var nextLineStart : int = 0;
		var lineWidth : float = 0;
		var info : CharacterInfo;
		var emergencyBrake : int = 0;

		switch ( alignment ) {
			case TextAnchor.UpperLeft:
				anchor.x = left;
				anchor.y = top;
				break;

			case TextAnchor.MiddleLeft:
				anchor.x = left;
				anchor.y = middle;
				break;

			case TextAnchor.LowerLeft:
				anchor.x = left;
				anchor.y = bottom;
				break;
			
			case TextAnchor.UpperCenter:
				anchor.x = center;
				anchor.y = top;
				break;

			case TextAnchor.MiddleCenter:
				anchor.x = center;
				anchor.y = middle;
				break;

			case TextAnchor.LowerCenter:
				anchor.x = center;
				anchor.y = bottom;
				break;
			
			case TextAnchor.UpperRight:
				anchor.y = top;
				break;

			case TextAnchor.MiddleRight:
				anchor.y = middle;
				break;

			case TextAnchor.LowerRight:
				anchor.y = bottom;
				break;
		}

		// Draw all glyphs
		GL.Color ( style.fontColor );
		
		while ( nextLineStart != -1 ) {
			// Get next line
			thisLineEnd = 0;
			var lastSpace : int = 0;
			lineWidth = 0;
			
			// ^ Parse remaining string, populate glyph queue
			for ( var c : int = nextLineStart; c < string.Length; c++ ) {
				// The line width has exceeded the border
				if ( lineWidth >= right ) {
					thisLineEnd = lastSpace - nextLineStart;
					nextLineStart = lastSpace;
					break;

				// This character is a space
				} else if ( string[c] == " "[0] && c != nextLineStart ) {
					info = new CharacterInfo ();
					info.index = -1;
					glyphs.Enqueue ( info );
					
					lineWidth += size * style.spacing;
					lastSpace = c;
					
				// This character is a regular glyph
				} else if ( style.font.GetCharacterInfo ( string[c], info ) ) {
					glyphs.Enqueue ( info );

					lineWidth += ( info.vert.width * size ) * style.spacing;

				// This character is a carriage return	
				} else if ( string[c] == "\n"[0] && c != nextLineStart ) {
					nextLineStart = c++;
					break;

				}
				
			}
			
			if ( c >= string.Length - 1 ) {
				// ^ The string has ended
				nextLineStart = -1;
			}

			if ( thisLineEnd == 0 ) {
				thisLineEnd = glyphs.Count;
			}

			// Alignment advance adjustments
			if ( anchor.x == center ) {
				advance.x -= lineWidth / 2;
			}

			// Draw glyphs
			for ( var g : int = 0; g < thisLineEnd; g++ ) {
				// Draw glyph
				if ( glyphs.Count > 0 ) {
					info = glyphs.Dequeue();
				} else {
					continue;
				}

				if ( info == null ) {
					continue;
				} else if ( info.index == -1 ) {
					advance.x += space;
					continue;
				}

				var vert : Rect = new Rect ( info.vert.x * size, info.vert.y * size, info.vert.width * size, info.vert.height * size );
				var uv : Vector2[] = new Vector2[4];
				
				if ( info.flipped ) {
					uv[3] = new Vector2 ( info.uv.x, info.uv.y + info.uv.height );
					uv[2] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y + info.uv.height );
					uv[1] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y );
					uv[0] = new Vector2 ( info.uv.x, info.uv.y );
				} else {
					uv[0] = new Vector2 ( info.uv.x, info.uv.y );
					uv[1] = new Vector2 ( info.uv.x, info.uv.y + info.uv.height );
					uv[2] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y + info.uv.height );
					uv[3] = new Vector2 ( info.uv.x + info.uv.width, info.uv.y );
				}		

				// Quad corners
				var gLeft : float = anchor.x + vert.x + rect.x + advance.x;
				var gRight : float = anchor.x + vert.x + rect.x + advance.x + vert.width;
				var gBottom : float = anchor.y + vert.height + vert.y + rect.y + advance.y;
				var gTop : float = anchor.y + vert.height + vert.y + rect.y + advance.y - vert.height;
			
				// Bottom Left
				GL.TexCoord2 ( uv[0].x, uv[0].y );
				GL.Vertex3 ( gLeft, gBottom, depth );
				
				// Top left
				GL.TexCoord2 ( uv[1].x, uv[1].y );
				GL.Vertex3 ( gLeft, gTop, depth );

				// Top right
				GL.TexCoord2 ( uv[2].x, uv[2].y );
				GL.Vertex3 ( gRight, gTop, depth );
			
				// Bottom right
				GL.TexCoord2 ( uv[3].x, uv[3].y );
				GL.Vertex3 ( gRight, gBottom, depth );

				advance.x += vert.width * style.spacing;
			}

			// Next line
			advance.y -= intSize * style.lineHeight;
			advance.x = 0;
			if ( glyphs.Count > 0 ) {
				glyphs.Clear ();
			}

			// Emergency
			if ( emergencyBrake > 10 ) {
				return;
			} else {
				emergencyBrake++;
			}
		}
		
		GL.Color ( Color.white );
	
	}


	//////////////////
	// Sprites
	//////////////////
	// Regular
	public static function DrawSprite ( rect : Rect, uvRect : Rect, depth : float ) {
		uvRect.x /= texSize.x;
		uvRect.y /= texSize.y;
		uvRect.width /= texSize.x;
		uvRect.height /= texSize.y;

		// Bottom Left	
		GL.TexCoord2 ( uvRect.x, uvRect.y );
		GL.Vertex3 ( rect.x, rect.y, depth );
		
		// Top left
		GL.TexCoord2 ( uvRect.x, uvRect.y + uvRect.height );
		GL.Vertex3 ( rect.x, rect.y + rect.height, depth );
		
		// Top right
		GL.TexCoord2 ( uvRect.x + uvRect.width, uvRect.y + uvRect.height );
		GL.Vertex3 ( rect.x + rect.width, rect.y + rect.height, depth );
		
		// Bottom right
		GL.TexCoord2 ( uvRect.x + uvRect.width, uvRect.y );
		GL.Vertex3 ( rect.x + rect.width, rect.y, depth );
	}

	// Tiled
	public static function DrawTiledSprite ( rect : Rect, uvRect : Rect, depth : float, tileX : float, tileY : float ) {
		for ( var x : int = 0; x < tileX; x++ ) {
			for ( var y : int = 0; y < tileY; y++ ) {
				var newScale : Vector2 = new Vector2 ( rect.width / tileX, rect.height / tileY );
				var newPosition : Vector2 = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), uvRect, depth );
			}
		}
	}

	// Sliced
	public static function DrawSlicedSprite ( rect : Rect, uvRect : Rect, border : OGSlicedSpriteOffset, depth : float ) {
		// Bottom left corner
		DrawSprite (
			new Rect ( rect.x, rect.y, border.left, border.bottom ),
			new Rect ( uvRect.x, uvRect.y, border.left, border.bottom ),
			depth
		);
	
		// Left panel
		DrawSprite (
			new Rect ( rect.x, rect.y + border.bottom, border.left, rect.height - border.bottom - border.top ),
			new Rect ( uvRect.x, uvRect.y + border.bottom, border.left, uvRect.height - border.top - border.bottom ),
			depth
		);

		// Top left corner
		DrawSprite (
			new Rect ( rect.x, rect.y + rect.height - border.top, border.left, border.top ),
			new Rect ( uvRect.x, uvRect.y + uvRect.height - border.top, border.left, border.top ),
			depth
		);

		// Top panel
		DrawSprite (
			new Rect ( rect.x + border.left, rect.y + rect.height - border.top, rect.width - border.horizontal, border.top ),
			new Rect ( uvRect.x + border.left, uvRect.y + uvRect.height - border.top, uvRect.width - border.horizontal, border.top ),
			depth
		);
		
		// Top right corner
		DrawSprite (
			new Rect ( rect.x + rect.width - border.right, rect.y + rect.height - border.top, border.right, border.top ),
			new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + uvRect.height - border.top, border.right, border.top ),
			depth
		);
		
		// Right panel
		DrawSprite (
			new Rect ( rect.x + rect.width - border.right, rect.y + border.bottom, border.right, rect.height - border.vertical ),
			new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + border.bottom, border.right, uvRect.height - border.vertical ),
			depth
		);

		// Bottom left corner
		DrawSprite (
			new Rect ( rect.x + rect.width - border.right, rect.y, border.right, border.bottom ),
			new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y, border.right, border.bottom ),
			depth
		);
		
		// Top panel
		DrawSprite (
			new Rect ( rect.x + border.left, rect.y, rect.width - border.horizontal, border.bottom ),
			new Rect ( uvRect.x + border.left, uvRect.y, uvRect.width - border.horizontal, border.bottom ),
			depth
		);
		
		// Center
		DrawSprite (
			new Rect ( rect.x + border.left, rect.y + border.bottom, rect.width - border.right - border.left, rect.height - border.bottom - border.top ),
			new Rect ( uvRect.x + border.left, uvRect.y + border.bottom, uvRect.width - border.right - border.left, uvRect.height - border.bottom - border.top ),
			depth
		);
	}
}

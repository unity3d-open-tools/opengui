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
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float, alpha : float ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth, alpha, null );
	}
		
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float, alpha : float, clipping : OGWidget ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth, alpha, clipping );
	}
	
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, intSize : int, alignment : TextAnchor, depth : float, alpha : float ) {
		DrawLabel ( rect, string, style, intSize, alignment, depth, alpha, null );
	}
		
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, intSize : int, alignment : TextAnchor, depth : float, alpha : float, clipping : OGWidget ) {
		// Check font
		if ( style.font == null ) {
			return;
		}

		// Check string
		if ( String.IsNullOrEmpty ( string ) ) {
			return;
		}

		// Check screen
		if ( rect.xMin > Screen.width || rect.xMax < 0 || rect.yMax < 0 || rect.yMin > Screen.height ) {
			return;
		}
		
		// Check clipping
		if ( clipping != null ) {
			if ( rect.xMin > clipping.drawRct.xMax || rect.xMax < clipping.drawRct.xMin || rect.yMax < clipping.drawRct.yMin || rect.yMin > clipping.drawRct.yMax ) {
				return;
			}
		}
		
		var size : float = ( intSize * 1.0 ) / 72;
		var atlasSize : Vector2 = new Vector2 ( style.font.material.mainTexture.width, style.font.material.mainTexture.height );
		var advance : Vector2;
		var left : float = style.padding.left;
		var right : float = rect.width - style.padding.right - style.padding.left;
		var top : float = rect.height - style.padding.top;
		var middle : float = ( rect.height / 2 ) + ( intSize / 2 );
		var center : float = style.padding.left + right / 2;
		var bottom : float = rect.height - style.padding.bottom;
		var anchor : Vector2;
		var space : float = ( intSize / 4 ) * style.spacing;
		var nextLineStart : int = 0;
		var thisLineStart : int = 0;
		var lastSpace : int = 0;
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
				anchor.x = right;
				anchor.y = top;
				break;

			case TextAnchor.MiddleRight:
				anchor.x = right;
				anchor.y = middle;
				break;

			case TextAnchor.LowerRight:
				anchor.x = right;
				anchor.y = bottom;
				break;
		}

		// Draw all glyphs
		var color : Color = style.fontColor;
		color.a *= alpha;
		GL.Color ( color );
		
		while ( nextLineStart != string.Length && advance.y > -bottom ) {
			// Get next line
			lastSpace = 0;
			lineWidth = 0;
			thisLineStart = nextLineStart;

			// ^ Parse remaining string, set start and end integers
			for ( var c : int = thisLineStart; c < string.Length; c++ ) {
				// This character is a space
				if ( string[c] == " "[0] ) {
					if ( lineWidth < right ) {
						lineWidth += space;
					}

					lastSpace = c;
					
				// This character is a regular glyph
				} else if ( style.font.GetCharacterInfo ( string[c], info ) ) {
					if ( lineWidth < right ) {
						lineWidth += ( info.vert.width * size ) * style.spacing;
					}

				// This character is a carriage return	
				} else if ( string[c] == "\n"[0] ) {
					nextLineStart = c + 1;
					break;

				}
				
				// The line width has exceeded the border
				if ( lineWidth >= right ) {
					nextLineStart = lastSpace + 1;
					break;
				}
			}
			
			// The string has ended
			if ( c >= string.Length - 1 ) {
				nextLineStart = string.Length;
			}

			// Alignment advance adjustments
			if ( anchor.x == center ) {
				advance.x -= lineWidth / 2;
			} else if ( anchor.x == right ) {
				advance.x -= lineWidth;
			}

			// Draw glyphs
			for ( var g : int = thisLineStart; g < nextLineStart; g++ ) {
				// Draw glyph
				if ( !style.font.GetCharacterInfo ( string[g], info ) ) {
					continue;
				}
				
				if ( string[g] == " "[0] ) {
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
			
				// Advance regardless if the glyph is drawn or not	
				advance.x += vert.width * style.spacing;
		
				// Clipping
				if ( clipping != null ) {
					if ( gLeft < clipping.drawRct.xMin ) {
						uv[0].x += ( clipping.drawRct.xMin - gLeft ) / atlasSize.x;
						uv[1].x += ( clipping.drawRct.xMin - gLeft ) / atlasSize.x;
						gLeft = clipping.drawRct.xMin;
					}
					
					if ( gRight > clipping.drawRct.xMax ) {
						uv[2].x -= ( gRight - clipping.drawRct.xMax ) / atlasSize.x;
						uv[3].x -= ( gRight - clipping.drawRct.xMax ) / atlasSize.x;
						gRight = clipping.drawRct.xMax;
					}
					
					if ( gBottom < clipping.drawRct.yMin ) {
						uv[0].y += ( clipping.drawRct.yMin - gBottom ) / atlasSize.y;
						uv[3].y += ( clipping.drawRct.yMin - gBottom ) / atlasSize.y;
						gBottom = clipping.drawRct.yMin;
					}
					
					if ( gTop > clipping.drawRct.yMax ) {
						uv[1].y += ( gTop - clipping.drawRct.yMax ) / atlasSize.y;
						uv[2].y += ( gTop - clipping.drawRct.yMax ) / atlasSize.y;
						gTop = clipping.drawRct.yMax;
					}

					// If the sides overlap, the glyph shouldn't be drawn
					if ( gLeft >= gRight || gBottom >= gTop ) {
						continue;
					}
				}

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

			}

			// Next line
			advance.y -= intSize * style.lineHeight;
			advance.x = 0;

			// Emergency
			if ( emergencyBrake > 10 ) {
				Debug.Log ( "SCREECH!" );
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
	public static function DrawSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float ) {
		DrawSprite ( rect, style, depth, alpha, null );
	}
	
	public static function DrawSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, clipping : OGWidget ) {
		DrawSprite ( rect, style.coordinates, depth, style.color, alpha, clipping );
	}	

	public static function DrawSprite ( rect : Rect, uvRect : Rect, depth : float, color : Color, alpha : float, clipping : OGWidget ) {
		// Check screen
		if ( rect.xMin > Screen.width || rect.xMax < 0 || rect.yMax < 0 || rect.yMin > Screen.height ) {
			return;
		}

		// Color
		color.a *= alpha;
		GL.Color ( color );

		// Quad corners
		var left : float = rect.x;
		var right : float = rect.x + rect.width;
		var bottom : float = rect.y;
		var top : float = rect.y + rect.height;
		
		// Check clipping
		if ( clipping != null ) {
			if ( rect.xMin > clipping.drawRct.xMax || rect.xMax < clipping.drawRct.xMin || rect.yMax < clipping.drawRct.yMin || rect.yMin > clipping.drawRct.yMax ) {
				return;
			} else {
				if ( left < clipping.drawRct.xMin ) { left = clipping.drawRct.xMin; }
				if ( right > clipping.drawRct.xMax ) { right = clipping.drawRct.xMax; }
				if ( bottom < clipping.drawRct.yMin ) { bottom = clipping.drawRct.yMin; }
				if ( top > clipping.drawRct.yMax ) { top = clipping.drawRct.yMax; }
			}
		}
		
		uvRect.x /= texSize.x;
		uvRect.y /= texSize.y;
		uvRect.width /= texSize.x;
		uvRect.height /= texSize.y;

		// Bottom Left	
		GL.TexCoord2 ( uvRect.x, uvRect.y );
		GL.Vertex3 ( left, bottom, depth );
		
		// Top left
		GL.TexCoord2 ( uvRect.x, uvRect.y + uvRect.height );
		GL.Vertex3 ( left, top, depth );
		
		// Top right
		GL.TexCoord2 ( uvRect.x + uvRect.width, uvRect.y + uvRect.height );
		GL.Vertex3 ( right, top, depth );
		
		// Bottom right
		GL.TexCoord2 ( uvRect.x + uvRect.width, uvRect.y );
		GL.Vertex3 ( right, bottom, depth );

		// Reset color
		GL.Color ( Color.white );
	}

	// Tiled
	public static function DrawTiledSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, tileX : float, tileY : float ) {
		DrawTiledSprite ( rect, style, depth, alpha, tileX, tileY, null );
	}
		
	public static function DrawTiledSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, tileX : float, tileY : float, clipping : OGWidget ) {
		for ( var x : int = 0; x < tileX; x++ ) {
			for ( var y : int = 0; y < tileY; y++ ) {
				var newScale : Vector2 = new Vector2 ( rect.width / tileX, rect.height / tileY );
				var newPosition : Vector2 = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), style, depth, alpha, clipping );
			}
		}
	}
	
	public static function DrawTiledSprite ( rect : Rect, uvRect : Rect, depth : float, color : Color, alpha : float, tileX : float, tileY : float, clipping : OGWidget ) {
		for ( var x : int = 0; x < tileX; x++ ) {
			for ( var y : int = 0; y < tileY; y++ ) {
				var newScale : Vector2 = new Vector2 ( rect.width / tileX, rect.height / tileY );
				var newPosition : Vector2 = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), uvRect, depth, color, alpha, clipping );
			}
		}
	}

	// Sliced
	public static function DrawSlicedSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float ) {
		DrawSlicedSprite ( rect, style, depth, alpha, null );
	}

	public static function DrawSlicedSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, clipping : OGWidget ) {
		var uvRect : Rect = style.coordinates;
		var border : OGSlicedSpriteOffset = style.border;
		var color : Color = style.color;

		// If no border is defined, draw a regular sprite
		if ( border.left == 0 && border.right == 0 && border.top == 0 && border.bottom == 0 ) {
			DrawSprite ( rect, style, depth, alpha, clipping );

		// Draw all corners, panels and the center	
		} else {
			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x, rect.y, border.left, border.bottom ),
				new Rect ( uvRect.x, uvRect.y, border.left, border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);
		
			// Left panel
			DrawSprite (
				new Rect ( rect.x, rect.y + border.bottom, border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x, uvRect.y + border.bottom, border.left, uvRect.height - border.top - border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);

			// Top left corner
			DrawSprite (
				new Rect ( rect.x, rect.y + rect.height - border.top, border.left, border.top ),
				new Rect ( uvRect.x, uvRect.y + uvRect.height - border.top, border.left, border.top ),
				depth,
				color,
				alpha,
				clipping
			);

			// Top panel
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y + rect.height - border.top, rect.width - border.horizontal, border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + uvRect.height - border.top, uvRect.width - border.horizontal, border.top ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Top right corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + rect.height - border.top, border.right, border.top ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + uvRect.height - border.top, border.right, border.top ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Right panel
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + border.bottom, border.right, rect.height - border.vertical ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + border.bottom, border.right, uvRect.height - border.vertical ),
				depth,
				color,
				alpha,
				clipping
			);

			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y, border.right, border.bottom ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y, border.right, border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Top panel
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y, rect.width - border.horizontal, border.bottom ),
				new Rect ( uvRect.x + border.left, uvRect.y, uvRect.width - border.horizontal, border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Center
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y + border.bottom, rect.width - border.right - border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + border.bottom, uvRect.width - border.right - border.left, uvRect.height - border.bottom - border.top ),
				depth,
				color,
				alpha,
				clipping
			);
		}
	}

	// Tiled sliced
	public static function DrawTiledSlicedSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, tileX : float, tileY : float ) {
		DrawSlicedSprite ( rect, style, depth, alpha, null );
	}

	public static function DrawTiledSlicedSprite ( rect : Rect, style : OGStyle, depth : float, alpha : float, tileX : float, tileY : float, clipping : OGWidget ) {
		var uvRect : Rect = style.coordinates;
		var border : OGSlicedSpriteOffset = style.border;
		var color : Color = style.color;

		// If no border is defined, draw a regular sprite
		if ( border.left == 0 && border.right == 0 && border.top == 0 && border.bottom == 0 ) {
			DrawSprite ( rect, style, depth, alpha, clipping );

		// Draw all corners, panels and the center	
		} else {
			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x, rect.y, border.left, border.bottom ),
				new Rect ( uvRect.x, uvRect.y, border.left, border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);
		
			// Left panel
			DrawTiledSprite (
				new Rect ( rect.x, rect.y + border.bottom, border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x, uvRect.y + border.bottom, border.left, uvRect.height - border.top - border.bottom ),
				depth,
				color,
				alpha,
				1.0,
				tileY,
				clipping
			);

			// Top left corner
			DrawSprite (
				new Rect ( rect.x, rect.y + rect.height - border.top, border.left, border.top ),
				new Rect ( uvRect.x, uvRect.y + uvRect.height - border.top, border.left, border.top ),
				depth,
				color,
				alpha,
				clipping
			);

			// Top panel
			DrawTiledSprite (
				new Rect ( rect.x + border.left, rect.y + rect.height - border.top, rect.width - border.horizontal, border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + uvRect.height - border.top, uvRect.width - border.horizontal, border.top ),
				depth,
				color,
				alpha,
				tileX,
				1.0,
				clipping
			);
			
			// Top right corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + rect.height - border.top, border.right, border.top ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + uvRect.height - border.top, border.right, border.top ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Right panel
			DrawTiledSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + border.bottom, border.right, rect.height - border.vertical ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + border.bottom, border.right, uvRect.height - border.vertical ),
				depth,
				color,
				alpha,
				1.0,
				tileY,
				clipping
			);

			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y, border.right, border.bottom ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y, border.right, border.bottom ),
				depth,
				color,
				alpha,
				clipping
			);
			
			// Top panel
			DrawTiledSprite (
				new Rect ( rect.x + border.left, rect.y, rect.width - border.horizontal, border.bottom ),
				new Rect ( uvRect.x + border.left, uvRect.y, uvRect.width - border.horizontal, border.bottom ),
				depth,
				color,
				alpha,
				tileX,
				1.0,
				clipping
			);
			
			// Center
			DrawTiledSprite (
				new Rect ( rect.x + border.left, rect.y + border.bottom, rect.width - border.right - border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + border.bottom, uvRect.width - border.right - border.left, uvRect.height - border.bottom - border.top ),
				depth,
				color,
				alpha,
				tileX,
				tileY,
				clipping
			);
		}
	}
}

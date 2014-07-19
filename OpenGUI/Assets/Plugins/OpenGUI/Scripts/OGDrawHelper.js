#pragma strict

import System.Collections.Generic;

public class OGDrawHelper {
	private static var texSize : Vector2;
	private static var root : OGRoot;


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
	// Curve
	//////////////////
	// Bezier
	public static function CalculateBezierPoint ( t : float, p0 : Vector3, p1 : Vector3, p2 : Vector3, p3 : Vector3 ) : Vector3 {
		var u : float = 1 - t;
		var tt : float = t*t;
	  	var uu : float = u*u;
	  	var uuu : float = uu * u;
	  	var ttt : float = tt * t;
	 
	  	var p : Vector3 = uuu * p0;
	  	p += 3 * uu * t * p1;
	  	p += 3 * u * tt * p2;
	  	p += ttt * p3;
	 
	  	return p;
	}	
	
	// Draw
	public static function DrawLine ( start : Vector3, end : Vector3, depth : float ) {
		GL.Vertex ( start + new Vector3 ( 0, 0, depth ) );
		GL.Vertex ( end + new Vector3 ( 0, 0, depth ) );
	}
	
	public static function DrawCurve ( start : Vector3, startDir : Vector3, endDir : Vector3, end : Vector3, segments : int ) {
		var lastPoint : Vector3; 

		for ( var i : int = 0; i < segments; i++ ) {
			var time : float = ( i * 1.0 ) * ( 1.0 / segments );
			var p : Vector3 = CalculateBezierPoint ( time, start, startDir, endDir, end );
		
			if ( i > 0 ) {
				GL.Vertex ( lastPoint );
				GL.Vertex ( p );
			}

			lastPoint = p;
		}
	}


	//////////////////
	// Label
	//////////////////
	// Get width
	public static function GetLabelWidth ( string : String, style : OGTextStyle ) : float {
		var width : float = style.padding.left + style.padding.right;
		
		var size : float = ( style.fontSize * 1.0 ) / style.font.size;
		var space : float = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		for ( var c : int = 0; c < string.Length; c++ ) {
			if ( string[c] == " "[0] ) {
				width += space;

			} else {
				var info : OGCharacterInfo = style.font.GetCharacterInfo ( string[c] );

				if ( info ) {
					width += info.width * size;
				}
			}
		}

		return width;
	}
	
	// Draw
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float, tint : Color ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth, tint, null, null );
	}
	
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float, tint : Color, clipping : OGWidget, editor : OGTextEditor ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth, tint, clipping, editor );
	}
		
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, depth : float, tint : Color, clipping : OGWidget ) {
		DrawLabel ( rect, string, style, style.fontSize, style.alignment, depth, tint, clipping, null );
	}
	
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, intSize : int, alignment : TextAnchor, depth : float, tint : Color ) {
		DrawLabel ( rect, string, style, intSize, alignment, depth, tint, null, null );
	}
	
	public static function DrawLabel ( rect : Rect, string : String, style : OGTextStyle, intSize : int, alignment : TextAnchor, depth : float, tint : Color, clipping : OGWidget, editor : OGTextEditor ) {
		// Check root
		if ( root == null ) {
			root = OGRoot.GetInstance ();
			return;
		}	
		
		// Check font
		if ( style.font == null ) {
			style.font = OGRoot.GetInstance().skin.fonts [ style.fontIndex ];
			return;
		}

		// Check string
		if ( String.IsNullOrEmpty ( string ) ) {
			if ( editor ) {
				editor.cursorIndex = 0;
				editor.cursorSelectIndex = 0;
				editor.cursorPos.x = rect.xMin;
				editor.cursorPos.y = rect.yMin - style.fontSize;
			}

			return;
		}

		// Check screen
		if ( rect.xMin > root.screenWidth || rect.xMax < 0 || rect.yMax < 0 || rect.yMin > root.screenHeight ) {
			return;
		}
		
		// Check clipping
		if ( clipping != null ) {
			if ( rect.xMin > clipping.drawRct.xMax || rect.xMax < clipping.drawRct.xMin || rect.yMax < clipping.drawRct.yMin || rect.yMin > clipping.drawRct.yMax ) {
				return;
			}
		}
		
		// Scale
		var size : float = ( intSize * 1.0 ) / style.font.size;
		var atlasSize : Vector2 = style.font.atlasSize;
		
		// Bounds
		var left : float = style.padding.left;
		var right : float = rect.width - style.padding.right - style.padding.left;
		var top : float = rect.height - style.padding.top;
		var bottom : float = style.padding.bottom;
		var middle : float = ( rect.height / 2 ) + ( ( style.font.info.lineSpacing * size ) / 2 );
		var center : float = left + right / 2;
		
		// Positioning
		var anchor : Vector2;
		var space : float = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		// Line and progression management
		var advance : Vector2;
		var nextLineStart : int = 0;
		var thisLineStart : int = 0;
		var lastSpace : int = 0;
		var lineWidth : float = 0;
		var lineHeight : float = style.font.info.lineSpacing * size;
		var emergencyBrake : int = 0;
		var closestGlyphToCursor : Vector2;
		
		// Temp vars
		var info : OGCharacterInfo;

		// Set anchor
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

		// Color
		var color : Color = style.fontColor;
		color.r *= tint.r;
		color.g *= tint.g;
		color.b *= tint.b;
		color.a *= tint.a;
		GL.Color ( color );
	
		// Draw loop
		while ( nextLineStart < string.Length && advance.y - style.padding.top > - ( rect.height - style.padding.top - style.padding.bottom ) ) {
			
			// Get next line
			lastSpace = 0;
			lineWidth = 0;
			thisLineStart = nextLineStart;

			// ^ Parse remaining string, set start and end integers
			for ( var c : int = thisLineStart; c < string.Length; c++ ) {
				info = style.font.GetCharacterInfo ( string[c] );
				
				// This character is a carriage return	
				if ( string[c] == "\n"[0] ) {
					nextLineStart = c + 1;
					break;
				
				// This character is a space
				} else if ( string[c] == " "[0] ) {
					lineWidth += space;
					lastSpace = c;
				
				// This character is a regular glyph
				} else if ( info ) {
					lineWidth += info.width * size;
				
				}

				// The line width has exceeded the border
				if ( lineWidth >= right ) {
					nextLineStart = lastSpace == 0 ? c : lastSpace + 1;
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
				info = style.font.GetCharacterInfo ( string[g] );
				
				if ( info == null ) {
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
	
				// If it's a space, set appropriate corners
				if ( string[g] == " "[0] ) {
					gRight += space;
				}

				// Set cursor position
				if ( editor && !String.IsNullOrEmpty ( editor.string ) ) {
					if ( editor.cursorIndex == g ) {
						editor.cursorPos.x = gLeft;
						editor.cursorPos.y = gBottom;
					
					} else if ( editor.cursorIndex >= editor.string.Length && g == editor.string.Length - 1 ) {
						editor.cursorPos.x = gRight;
						editor.cursorPos.y = gBottom;

					}
					
					
					if ( editor.cursorSelectIndex == g ) {
						editor.cursorSelectPos.x = gLeft;
						editor.cursorSelectPos.y = gBottom;
					
					} else if ( editor.cursorSelectIndex >= editor.string.Length && g == editor.string.Length - 1 ) {
						editor.cursorSelectPos.x = gRight;
						editor.cursorSelectPos.y = gBottom;

					}

					editor.cursorSize.x = 1;
					editor.cursorSize.y = style.fontSize;
				}
				
				// If it's a space, continue the loop
				if ( string[g] == " "[0] ) {
					advance.x += space;
					continue;
				}
			
				// Advance regardless if the glyph is drawn or not	
				advance.x += info.width * size;
		
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
			advance.y -= lineHeight;
			advance.x = 0;

			// Emergency
			if ( emergencyBrake > 1000 ) {
				Debug.Log ( "OGDrawHelper | Label exceeded 1000 lines!" );
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
	public static function DrawSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color ) {
		if ( style == null ) { return; }

		DrawSprite ( rect, style, depth, tint, null );
	}
	
	public static function DrawSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, clipping : OGWidget ) {
		if ( style == null ) { return; }

		DrawSprite ( rect, style.coordinates, depth, style.color, tint, clipping );
	}	

	public static function DrawSprite ( rect : Rect, uvRect : Rect, depth : float, color : Color, tint : Color, clipping : OGWidget ) {
		if ( !root ) {
			root = OGRoot.GetInstance();
			return;
		}
		
		// Check screen
		if ( rect.xMin > root.screenWidth || rect.xMax < 0 || rect.yMax < 0 || rect.yMin > root.screenHeight ) {
			return;
		}

		// Color
		color.r *= tint.r;
		color.g *= tint.g;
		color.b *= tint.b;
		color.a *= tint.a;
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
	public static function DrawTiledSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, tileX : float, tileY : float ) {
		DrawTiledSprite ( rect, style, depth, tint, tileX, tileY, null );
	}
		
	public static function DrawTiledSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, tileX : float, tileY : float, clipping : OGWidget ) {
		for ( var x : int = 0; x < tileX; x++ ) {
			for ( var y : int = 0; y < tileY; y++ ) {
				var newScale : Vector2 = new Vector2 ( rect.width / tileX, rect.height / tileY );
				var newPosition : Vector2 = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), style, depth, tint, clipping );
			}
		}
	}
	
	public static function DrawTiledSprite ( rect : Rect, uvRect : Rect, depth : float, color : Color, tint : Color, tileX : float, tileY : float, clipping : OGWidget ) {
		for ( var x : int = 0; x < tileX; x++ ) {
			for ( var y : int = 0; y < tileY; y++ ) {
				var newScale : Vector2 = new Vector2 ( rect.width / tileX, rect.height / tileY );
				var newPosition : Vector2 = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), uvRect, depth, color, tint, clipping );
			}
		}
	}

	// Sliced
	public static function DrawSlicedSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color ) {
		DrawSlicedSprite ( rect, style, depth, tint, null );
	}

	public static function DrawSlicedSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, clipping : OGWidget ) {
		if ( !style ) { return; }
		
		var uvRect : Rect = style.coordinates;
		var border : OGSlicedSpriteOffset = style.border;
		var color : Color = style.color;

		// If no border is defined, draw a regular sprite
		if ( border.left == 0 && border.right == 0 && border.top == 0 && border.bottom == 0 ) {
			DrawSprite ( rect, style, depth, tint, clipping );

		// Draw all corners, panels and the center	
		} else {
			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x, rect.y, border.left, border.bottom ),
				new Rect ( uvRect.x, uvRect.y, border.left, border.bottom ),
				depth,
				color,
				tint,
				clipping
			);
		
			// Left panel
			DrawSprite (
				new Rect ( rect.x, rect.y + border.bottom, border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x, uvRect.y + border.bottom, border.left, uvRect.height - border.top - border.bottom ),
				depth,
				color,
				tint,
				clipping
			);

			// Top left corner
			DrawSprite (
				new Rect ( rect.x, rect.y + rect.height - border.top, border.left, border.top ),
				new Rect ( uvRect.x, uvRect.y + uvRect.height - border.top, border.left, border.top ),
				depth,
				color,
				tint,
				clipping
			);

			// Top panel
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y + rect.height - border.top, rect.width - border.horizontal, border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + uvRect.height - border.top, uvRect.width - border.horizontal, border.top ),
				depth,
				color,
				tint,
				clipping
			);
			
			// Top right corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + rect.height - border.top, border.right, border.top ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + uvRect.height - border.top, border.right, border.top ),
				depth,
				color,
				tint,
				clipping
			);
			
			// Right panel
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + border.bottom, border.right, rect.height - border.vertical ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + border.bottom, border.right, uvRect.height - border.vertical ),
				depth,
				color,
				tint,
				clipping
			);

			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y, border.right, border.bottom ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y, border.right, border.bottom ),
				depth,
				color,
				tint,
				clipping
			);
			
			// Top panel
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y, rect.width - border.horizontal, border.bottom ),
				new Rect ( uvRect.x + border.left, uvRect.y, uvRect.width - border.horizontal, border.bottom ),
				depth,
				color,
				tint,
				clipping
			);
			
			// Center
			DrawSprite (
				new Rect ( rect.x + border.left, rect.y + border.bottom, rect.width - border.right - border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + border.bottom, uvRect.width - border.right - border.left, uvRect.height - border.bottom - border.top ),
				depth,
				color,
				tint,
				clipping
			);
		}
	}

	// Tiled sliced
	public static function DrawTiledSlicedSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, tileX : float, tileY : float ) {
		DrawSlicedSprite ( rect, style, depth, tint, null );
	}

	public static function DrawTiledSlicedSprite ( rect : Rect, style : OGStyle, depth : float, tint : Color, tileX : float, tileY : float, clipping : OGWidget ) {
		var uvRect : Rect = style.coordinates;
		var border : OGSlicedSpriteOffset = style.border;
		var color : Color = style.color;

		// If no border is defined, draw a regular sprite
		if ( border.left == 0 && border.right == 0 && border.top == 0 && border.bottom == 0 ) {
			DrawSprite ( rect, style, depth, tint, clipping );

		// Draw all corners, panels and the center	
		} else {
			// Bottom left corner
			DrawSprite (
				new Rect ( rect.x, rect.y, border.left, border.bottom ),
				new Rect ( uvRect.x, uvRect.y, border.left, border.bottom ),
				depth,
				color,
				tint,
				clipping
			);
		
			// Left panel
			DrawTiledSprite (
				new Rect ( rect.x, rect.y + border.bottom, border.left, rect.height - border.bottom - border.top ),
				new Rect ( uvRect.x, uvRect.y + border.bottom, border.left, uvRect.height - border.top - border.bottom ),
				depth,
				color,
				tint,
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
				tint,
				clipping
			);

			// Top panel
			DrawTiledSprite (
				new Rect ( rect.x + border.left, rect.y + rect.height - border.top, rect.width - border.horizontal, border.top ),
				new Rect ( uvRect.x + border.left, uvRect.y + uvRect.height - border.top, uvRect.width - border.horizontal, border.top ),
				depth,
				color,
				tint,
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
				tint,
				clipping
			);
			
			// Right panel
			DrawTiledSprite (
				new Rect ( rect.x + rect.width - border.right, rect.y + border.bottom, border.right, rect.height - border.vertical ),
				new Rect ( uvRect.x + uvRect.width - border.right, uvRect.y + border.bottom, border.right, uvRect.height - border.vertical ),
				depth,
				color,
				tint,
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
				tint,
				clipping
			);
			
			// Top panel
			DrawTiledSprite (
				new Rect ( rect.x + border.left, rect.y, rect.width - border.horizontal, border.bottom ),
				new Rect ( uvRect.x + border.left, uvRect.y, uvRect.width - border.horizontal, border.bottom ),
				depth,
				color,
				tint,
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
				tint,
				tileX,
				tileY,
				clipping
			);
		}
	}
}

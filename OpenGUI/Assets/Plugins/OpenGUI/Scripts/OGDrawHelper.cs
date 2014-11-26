using UnityEngine;
using System.Collections;

using System.Collections.Generic;

[System.Serializable]
public class OGDrawHelper {
	private static Vector2 texSize;
	private static OGRoot root;


	//////////////////
	// Core
	//////////////////
	// Pass
	public static void SetPass ( Material mat ) {
		mat.SetPass ( 0 );
		texSize.x = mat.mainTexture.width;
		texSize.y = mat.mainTexture.height;
	}

	
	//////////////////
	// Curve
	//////////////////
	// Bezier
	public static Vector3 CalculateBezierPoint ( float t, Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3 ) {
		float u = 1 - t;
		float tt = t*t;
	  	float uu = u*u;
	  	float uuu = uu * u;
	  	float ttt = tt * t;
	 
	  	Vector3 p = uuu * p0;
	  	p += 3 * uu * t * p1;
	  	p += 3 * u * tt * p2;
	  	p += ttt * p3;
	 
	  	return p;
	}	
	
	// Draw
	public static void DrawLine ( Vector3 start, Vector3 end, float depth ) {
		GL.Vertex ( start + new Vector3 ( 0, 0, depth ) );
		GL.Vertex ( end + new Vector3 ( 0, 0, depth ) );
	}
	
	public static void DrawCurve ( Vector3 start, Vector3 startDir, Vector3 endDir, Vector3 end, int segments ) {
		Vector3 lastPoint = Vector3.zero; 

		for ( int i = 0; i < segments; i++ ) {
			float time = ( i * 1.0f ) * ( 1.0f / segments );
			Vector3 p = CalculateBezierPoint ( time, start, startDir, endDir, end );
		
			if ( i > 0f ) {
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
	public static float GetLabelWidth ( string str, OGTextStyle style ) {
		float width = style.padding.left + style.padding.right;
		
		float size = ( style.fontSize * 1.0f ) / style.font.size;
		float space = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		for ( int c = 0; c < str.Length; c++ ) {
			if ( str[c] == " "[0] ) {
				width += space;

			} else {
				OGCharacterInfo info = style.font.GetCharacterInfo ( str[c] );

				if ( info != null ) {
					width += info.width * size;
				}
			}
		}

		return width;
	}
	
	// Draw
	public static void DrawLabel ( Rect rect, string str, OGTextStyle style, float depth, Color tint ) {
		DrawLabel ( rect, str, style, style.fontSize, style.alignment, depth, tint, null, null );
	}
	
	public static void DrawLabel ( Rect rect, string str, OGTextStyle style, float depth, Color tint, OGWidget clipping, OGTextEditor editor ) {
		DrawLabel ( rect, str, style, style.fontSize, style.alignment, depth, tint, clipping, editor );
	}
		
	public static void DrawLabel ( Rect rect, string str, OGTextStyle style, float depth, Color tint, OGWidget clipping ) {
		DrawLabel ( rect, str, style, style.fontSize, style.alignment, depth, tint, clipping, null );
	}
	
	public static void DrawLabel ( Rect rect, string str, OGTextStyle style, int intSize, TextAnchor alignment, float depth, Color tint ) {
		DrawLabel ( rect, str, style, intSize, alignment, depth, tint, null, null );
	}
	
	public static void DrawLabel ( Rect rect, string str, OGTextStyle style, int intSize, TextAnchor alignment, float depth, Color tint, OGWidget clipping, OGTextEditor editor ) {
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
		if ( string.IsNullOrEmpty ( str ) ) {
			if ( editor != null ) {
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
		float size = ( intSize * 1.0f ) / style.font.size;
		Vector2 atlasSize = style.font.atlasSize;
		
		// Bounds
		float left = style.padding.left;
		float right = rect.width - style.padding.right - style.padding.left;
		float top = rect.height - style.padding.top;
		float bottom = style.padding.bottom;
		float middle = ( rect.height / 2 ) + ( ( style.font.info.lineSpacing * size ) / 2 );
		float center = left + right / 2;
		
		// Positioning
		Vector2 anchor = Vector2.zero;
		float space = ( style.font.GetCharacterInfo ( " "[0] ).width * size );
		
		// Line and progression management
		Vector2 advance = Vector2.zero;
		int nextLineStart = 0;
		int thisLineStart = 0;
		int lastSpace = 0;
		float lineWidth = 0;
		float lineWidthAtLastSpace = 0;
		float lineHeight = style.font.info.lineSpacing * size;
		int emergencyBrake = 0;
		
		// Temp vars
		OGCharacterInfo info;

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
		Color color = style.fontColor;
		color.r *= tint.r;
		color.g *= tint.g;
		color.b *= tint.b;
		color.a *= tint.a;
		GL.Color ( color );
	
		// Draw loop
		while ( nextLineStart < str.Length && advance.y - style.padding.top > - ( rect.height - style.padding.top - style.padding.bottom ) ) {
			int c = 0;

			// Get next line
			lastSpace = 0;
			lineWidth = 0;
			thisLineStart = nextLineStart;

			// ^ Parse remaining string, set start and end integers
			for ( c = thisLineStart; c < str.Length; c++ ) {
				info = style.font.GetCharacterInfo ( str[c] );
				
				// This character is a carriage return	
				if ( str[c] == "\n"[0] ) {
					nextLineStart = c + 1;
					break;
				
				// This character is a space
				} else if ( str[c] == " "[0] ) {
					lineWidthAtLastSpace = lineWidth;
					lineWidth += space;
					lastSpace = c;
				
				// This character is a regular glyph
				} else if ( info != null ) {
					lineWidth += info.width * size;
				
				}

				// The line width has exceeded the border
				if ( lineWidth >= right ) {
					nextLineStart = lastSpace == 0 ? lastSpace : c + 1;
					lineWidth = lineWidthAtLastSpace;
					break;
				}
			}
			
			// The string has ended
			if ( c >= str.Length - 1 ) {
				nextLineStart = str.Length;
			}

			// Alignment advance adjustments
			if ( anchor.x == center ) {
				advance.x -= lineWidth / 2;
			} else if ( anchor.x == right ) {
				advance.x -= lineWidth;
			}
		
			// Draw glyphs
			for ( int g = thisLineStart; g < nextLineStart; g++ ) {
				info = style.font.GetCharacterInfo ( str[g] );
				
				if ( info == null ) {
					continue;
				}

				Rect vert = new Rect ( info.vert.x * size, info.vert.y * size, info.vert.width * size, info.vert.height * size );
				Vector2[] uv = new Vector2[4];

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
				float gLeft = anchor.x + vert.x + rect.x + advance.x;
				float gRight = anchor.x + vert.x + rect.x + advance.x + vert.width;
				float gBottom = anchor.y + vert.height + vert.y + rect.y + advance.y;
				float gTop = anchor.y + vert.height + vert.y + rect.y + advance.y - vert.height;
	
				// If it's a space, set appropriate corners
				if ( str[g] == " "[0] ) {
					gRight += space;
				}

				// Set cursor position
				if ( editor != null ) {
					if ( editor.cursorIndex == g ) {
						editor.cursorPos.x = gLeft;
						editor.cursorPos.y = gBottom;
					
					} else if ( editor.cursorIndex >= editor.str.Length && g == editor.str.Length - 1 ) {
						editor.cursorPos.x = gRight;
						editor.cursorPos.y = gBottom;

					}
					
					
					if ( editor.cursorSelectIndex == g ) {
						editor.cursorSelectPos.x = gLeft;
						editor.cursorSelectPos.y = gBottom;
					
					} else if ( editor.cursorSelectIndex >= editor.str.Length && g == editor.str.Length - 1 ) {
						editor.cursorSelectPos.x = gRight;
						editor.cursorSelectPos.y = gBottom;

					}

					editor.cursorSize.x = 1;
					editor.cursorSize.y = style.fontSize;
				}
				
				// If it's a space, continue the loop
				if ( str[g] == " "[0] ) {
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
	public static void DrawSprite ( Rect rect, OGStyle style, float depth, Color tint ) {
		if ( style == null ) { return; }

		DrawSprite ( rect, style, depth, tint, null );
	}
	
	public static void DrawSprite ( Rect rect, OGStyle style, float depth, Color tint, OGWidget clipping ) {
		if ( style == null ) { return; }

		DrawSprite ( rect, style.coordinates, depth, style.color, tint, clipping );
	}	

	public static void DrawSprite ( Rect rect, Rect uvRect, float depth, Color color, Color tint, OGWidget clipping ) {
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
		float left = rect.x;
		float right = rect.x + rect.width;
		float bottom = rect.y;
		float top = rect.y + rect.height;
		
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
	public static void DrawTiledSprite ( Rect rect, OGStyle style, float depth, Color tint, float tileX, float tileY ) {
		DrawTiledSprite ( rect, style, depth, tint, tileX, tileY, null );
	}
		
	public static void DrawTiledSprite ( Rect rect, OGStyle style, float depth, Color tint, float tileX, float tileY, OGWidget clipping ) {
		for ( int x = 0; x < tileX; x++ ) {
			for ( int y = 0; y < tileY; y++ ) {
				Vector2 newScale = new Vector2 ( rect.width / tileX, rect.height / tileY );
				Vector2 newPosition = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), style, depth, tint, clipping );
			}
		}
	}
	
	public static void DrawTiledSprite ( Rect rect, Rect uvRect, float depth, Color color, Color tint, float tileX, float tileY, OGWidget clipping ) {
		for ( int x = 0; x < tileX; x++ ) {
			for ( int y = 0; y < tileY; y++ ) {
				Vector2 newScale = new Vector2 ( rect.width / tileX, rect.height / tileY );
				Vector2 newPosition = new Vector2 ( rect.x + x * newScale.x, rect.y + y * newScale.y );

				DrawSprite ( new Rect ( newPosition.x, newPosition.y, newScale.x, newScale.y ), uvRect, depth, color, tint, clipping );
			}
		}
	}

	// Sliced
	public static void DrawSlicedSprite ( Rect rect, OGStyle style, float depth, Color tint ) {
		DrawSlicedSprite ( rect, style, depth, tint, null );
	}

	public static void DrawSlicedSprite ( Rect rect, OGStyle style, float depth, Color tint, OGWidget clipping ) {
		if ( style == null ) { return; }
		
		Rect uvRect = style.coordinates;
		OGSlicedSpriteOffset border = style.border;
		Color color = style.color;

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
	public static void DrawTiledSlicedSprite ( Rect rect, OGStyle style, float depth, Color tint, float tileX, float tileY ) {
		DrawSlicedSprite ( rect, style, depth, tint, null );
	}

	public static void DrawTiledSlicedSprite ( Rect rect, OGStyle style, float depth, Color tint, float tileX, float tileY, OGWidget clipping ) {
		Rect uvRect = style.coordinates;
		OGSlicedSpriteOffset border = style.border;
		Color color = style.color;

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
				1.0f,
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
				1.0f,
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
				1.0f,
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
				1.0f,
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

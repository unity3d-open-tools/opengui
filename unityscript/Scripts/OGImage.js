#pragma strict

@script AddComponentMenu ("OpenGUI/Image")

class OGImage extends OGWidget {
	enum XorY {
		X,
		Y
	}
	
	var image : Texture2D;
	var scale : ScaleMode;
	var alphaBlend : boolean = true;
	var repeatTexture : Vector2;
	var maintainRatio : XorY;
	
	override function UpdateWidget () {
		if ( image ) {
			if ( image.wrapMode != TextureWrapMode.Repeat ) {
				image.wrapMode = TextureWrapMode.Repeat;
			}
		}
	}
	
	override function Draw ( x : float, y : float ) {
		if ( image ) {						
			if ( repeatTexture.x > 0 || repeatTexture.y > 0 ) {
				if ( maintainRatio == XorY.X ) {
					var ratioX : float = transform.localScale.y / transform.localScale.x;
					
					repeatTexture.y = repeatTexture.x * ratioX;
				} else if ( maintainRatio == XorY.Y ) {
					var ratioY : float = transform.localScale.x / transform.localScale.y;
					
					repeatTexture.x = repeatTexture.y * ratioY;
				}
				
				GUI.DrawTextureWithTexCoords ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), image, Rect ( 0, 0, repeatTexture.x, repeatTexture.y ), alphaBlend );
			} else {
				GUI.DrawTexture ( Rect ( x, y, transform.localScale.x, transform.localScale.y ), image, scale, alphaBlend, 0.0 );
			}
		}
	}
}
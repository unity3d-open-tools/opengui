#pragma strict

public class OGTexture extends OGWidget {
	enum XorY {
		X,
		Y
	}
	
	var mainTexture : Texture2D;
	var scale : ScaleMode;
	var alphaBlend : boolean = true;
	var repeatTexture : Vector2;
	var maintainRatio : XorY;
	
	override function UpdateWidget ( root : OGRoot ) {
		if ( mainTexture ) {
			if ( mainTexture.wrapMode != TextureWrapMode.Repeat ) {
				mainTexture.wrapMode = TextureWrapMode.Repeat;
			}
		}
	}
	
	override function DrawGUI () {
		if ( mainTexture ) {						
			var x : float = this.transform.position.x + offset.x + scrollOffset.x;
			var y : float = this.transform.position.y + offset.y + scrollOffset.y;
			
			if ( repeatTexture.x > 0 || repeatTexture.y > 0 ) {
				if ( maintainRatio == XorY.X ) {
					var ratioX : float = transform.localScale.y / transform.localScale.x;
					
					repeatTexture.y = repeatTexture.x * ratioX;
				} else if ( maintainRatio == XorY.Y ) {
					var ratioY : float = transform.localScale.x / transform.localScale.y;
					
					repeatTexture.x = repeatTexture.y * ratioY;
				}
				
				GUI.DrawTextureWithTexCoords ( Rect ( x, y, transform.lossyScale.x, transform.lossyScale.y ), mainTexture, Rect ( 0, 0, repeatTexture.x, repeatTexture.y ), alphaBlend );
			} else {
				GUI.DrawTexture ( Rect ( x, y, transform.lossyScale.x, transform.lossyScale.y ), mainTexture, scale, alphaBlend, 0.0 );
			}
		}
	}
}
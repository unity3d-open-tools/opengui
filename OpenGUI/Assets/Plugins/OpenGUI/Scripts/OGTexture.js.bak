#pragma strict

public class OGTexture extends OGWidget {
	public var mainTexture : Texture2D;
	
	private var material : Material;

	override function UpdateWidget () {
		
		mouseRct = drawRct;
	}

	override function DrawGL () {
		if ( drawRct == null || mainTexture == null ) {
			return;
		}
	
		if ( material == null ) {
			material = new Material ( root.skin.atlas.shader );
			return;
		}

		if ( material.mainTexture != mainTexture ) {
			material.mainTexture = mainTexture;
			return;
		}

		var displayRct : Rect = drawRct;
		var uvRct : Rect = drawCrd;

		if ( clipTo ) {
			if ( clipTo.drawRct.xMin > displayRct.xMin ) {
				uvRct.xMin = ( clipTo.drawRct.xMin - displayRct.xMin ) / this.transform.lossyScale.x;
				displayRct.xMin = clipTo.drawRct.xMin;
			}
			
			if ( clipTo.drawRct.xMax < displayRct.xMax ) {
				uvRct.xMax = ( displayRct.xMax - clipTo.drawRct.xMax ) / this.transform.lossyScale.x;
				displayRct.xMax = clipTo.drawRct.xMax;
			}
			
			if ( clipTo.drawRct.yMin > displayRct.yMin ) {
				uvRct.yMin = ( clipTo.drawRct.yMin - displayRct.yMin ) / this.transform.lossyScale.y;
				displayRct.yMin = clipTo.drawRct.yMin;
			}
			
			if ( clipTo.drawRct.yMax < displayRct.yMax ) {
				uvRct.yMax = ( displayRct.yMax - clipTo.drawRct.yMax ) / this.transform.lossyScale.y;
				displayRct.yMax = clipTo.drawRct.yMax;
			}
		}

		GL.Begin(GL.QUADS);
		
		GL.Color ( tint );
		
		material.SetPass ( 0 );

		// Bottom Left	
		GL.TexCoord2 ( uvRct.x, uvRct.y );
		GL.Vertex3 ( displayRct.x, displayRct.y, drawDepth );
		
		// Top left
		GL.TexCoord2 ( uvRct.x, uvRct.y + uvRct.height );
		GL.Vertex3 ( displayRct.x, displayRct.y + displayRct.height, drawDepth );
		
		// Top right
		GL.TexCoord2 ( uvRct.x + uvRct.width, uvRct.y + uvRct.height );
		GL.Vertex3 ( displayRct.x + displayRct.width, displayRct.y + displayRct.height, drawDepth );
		
		// Bottom right
		GL.TexCoord2 ( uvRct.x + uvRct.width, uvRct.y );
		GL.Vertex3 ( displayRct.x + displayRct.width, displayRct.y, drawDepth );
		
		GL.Color ( Color.white );

		GL.End();
	}
}

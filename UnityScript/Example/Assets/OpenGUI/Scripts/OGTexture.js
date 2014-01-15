#pragma strict

public class OGTexture extends OGWidget {
	public var mainTexture : Texture2D;
	
	private var material : Material;

	override function UpdateWidget () {
		
		mouseRct = drawRct;
	}

	override function DrawGL () {
		if ( drawCrd == null || drawRct == null || mainTexture == null ) { return; }
	
		if ( material == null ) {
			material = new Material ( GetRoot().skin.atlas.shader );
		}

		if ( material.mainTexture != mainTexture ) {
			material.mainTexture = mainTexture;
		}

		GL.Begin(GL.QUADS);
		
		material.SetPass ( 0 );

		// Bottom Left	
		GL.TexCoord2 ( drawCrd.x, drawCrd.y );
		GL.Vertex3 ( drawRct.x, drawRct.y, drawDepth );
		
		// Top left
		GL.TexCoord2 ( drawCrd.x, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( drawRct.x, drawRct.y + drawRct.height, drawDepth );
		
		// Top right
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( drawRct.x + drawRct.width, drawRct.y + drawRct.height, drawDepth );
		
		// Bottom right
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y );
		GL.Vertex3 ( drawRct.x + drawRct.width, drawRct.y, drawDepth );
		
		GL.End();
	}
}

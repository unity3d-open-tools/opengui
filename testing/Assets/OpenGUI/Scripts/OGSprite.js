#pragma strict

public class OGSprite extends OGWidget {
	public var tile : Vector2 = Vector2.one;
	
	//////////////////
	// Draw
	//////////////////
	private function DrawQuad ( xInt : int, yInt : int ) {
		var width : float = drawRct.width / tile.x;
		var height : float = drawRct.height / tile.y;
		var x : float = drawRct.x + ( xInt * width );
		var y : float = drawRct.y + ( yInt * height );
		
		// Bottom Left	
		GL.TexCoord2 ( drawCrd.x, drawCrd.y );
		GL.Vertex3 ( x, y, drawDepth );
		
		// Top left
		GL.TexCoord2 ( drawCrd.x, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( x, y + height, drawDepth );
		
		// Top right
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y + drawCrd.height );
		GL.Vertex3 ( x + width, y + height, drawDepth );
		
		// Bottom right
		GL.TexCoord2 ( drawCrd.x + drawCrd.width, drawCrd.y );
		GL.Vertex3 ( x + width, y, drawDepth );
	}
	
	override function DrawGL () {
		if ( drawCrd == null || drawRct == null ) { return; }
		
		for ( var x : int = 0; x < tile.x; x++ ) {
			for ( var y : int = 0; y < tile.y; y++ ) {
				DrawQuad ( x, y );
			}
		}
	}

	////////////////
	// Update
	////////////////
	override function UpdateWidget () {
		tile.x = Mathf.Floor ( tile.x ); 
		tile.y = Mathf.Floor ( tile.y ); 
		
		selectable = false;
	
		mouseRct = drawRct;
	}
}

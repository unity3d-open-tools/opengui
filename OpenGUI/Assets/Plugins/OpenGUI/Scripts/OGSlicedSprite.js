#pragma strict

public class OGSlicedSprite extends OGWidget {
	public var tile : Vector2 = Vector2.one;
	
	//////////////////
	// Update
	//////////////////	
	override function UpdateWidget () {
		mouseRct = drawRct;
	}
	
	
	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		if ( drawRct == null ) { return; }

		if ( tile.x == 1 && tile.y == 1 ) {
			OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );
		
		} else {
			OGDrawHelper.DrawTiledSlicedSprite ( drawRct, styles.basic, drawDepth, tint, tile.x, tile.y, clipTo );
		
		}
	}
}

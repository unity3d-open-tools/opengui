#pragma strict

public class OGSprite extends OGWidget {
	public var tile : Vector2 = Vector2.one;
	
	//////////////////
	// Draw
	//////////////////
	override function DrawGL () {
		if ( drawCrd == null || drawRct == null ) { return; }
		
		if ( tile.x != 1 || tile.y != 1 ) {
			OGDrawHelper.DrawTiledSprite ( drawRct, drawCrd, drawDepth, tile.x, tile.y );
		} else {
			OGDrawHelper.DrawSprite ( drawRct, drawCrd, drawDepth );
		}
	}

	////////////////
	// Update
	////////////////
	override function UpdateWidget () {
		tile.x = Mathf.Floor ( tile.x ); 
		tile.y = Mathf.Floor ( tile.y ); 
	
		mouseRct = drawRct;
	}
}

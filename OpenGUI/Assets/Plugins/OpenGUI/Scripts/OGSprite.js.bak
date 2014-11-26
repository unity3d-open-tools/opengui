#pragma strict

public class OGSprite extends OGWidget {
	public var tile : Vector2 = Vector2.one;
	
	//////////////////
	// Draw
	//////////////////
	override function DrawSkin () {
		if ( drawCrd == null || drawRct == null ) { return; }
		
		if ( tile.x != 1 || tile.y != 1 ) {
			OGDrawHelper.DrawTiledSprite ( drawRct, styles.basic, drawDepth, tint, tile.x, tile.y, clipTo );
		} else {
			OGDrawHelper.DrawSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );
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

using UnityEngine;
using System.Collections;

public class OGSprite : OGWidget {
	public Vector2 tile = Vector2.one;
	
	//////////////////
	// Draw
	//////////////////
	override public void DrawSkin () {
		if ( drawCrd == new Rect() || drawRct == new Rect() ) { return; }
		
		if ( tile.x != 1 || tile.y != 1 ) {
			OGDrawHelper.DrawTiledSprite ( drawRct, styles.basic, drawDepth, tint, tile.x, tile.y, clipTo );
		} else {
			OGDrawHelper.DrawSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );
		}
	}

	////////////////
	// Update
	////////////////
	override public void UpdateWidget () {
		tile.x = Mathf.Floor ( tile.x ); 
		tile.y = Mathf.Floor ( tile.y ); 
	
		mouseRct = drawRct;
	}
}

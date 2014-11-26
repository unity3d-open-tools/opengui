using UnityEngine;
using System.Collections;

public class OGSlicedSprite : OGWidget {
	public Vector2 tile = Vector2.one;
	
	//////////////////
	// Update
	//////////////////	
	override public void UpdateWidget () {
		mouseRct = drawRct;
	}
	
	
	//////////////////
	// Draw
	//////////////////
	override public void DrawSkin () {
		if ( drawRct == new Rect() ) { return; }

		if ( tile.x == 1 && tile.y == 1 ) {
			OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic, drawDepth, tint, clipTo );
		
		} else {
			OGDrawHelper.DrawTiledSlicedSprite ( drawRct, styles.basic, drawDepth, tint, tile.x, tile.y, clipTo );
		
		}
	}
}

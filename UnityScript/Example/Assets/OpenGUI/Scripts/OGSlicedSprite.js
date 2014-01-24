#pragma strict

public class OGSlicedSprite extends OGWidget {
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

		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic.coordinates, styles.basic.border, drawDepth, clipTo );
	}
}

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
	override function DrawGL () {
		if ( drawCrd == null || drawRct == null ) { return; }

		OGDrawHelper.DrawSlicedSprite ( drawRct, drawCrd, styles.basic.border, drawDepth );
	}
}

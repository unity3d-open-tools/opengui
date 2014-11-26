#pragma strict

public class OGTickBox extends OGWidget {
	public var text : String;
	public var isTicked : boolean;
	
	private var isDown : boolean = false;

	
	////////////////
	// Interaction
	////////////////	
	override function OnMouseCancel () {
		isDown = false;
		root.ReleaseWidget ();
	}
	
	override function OnMouseDown () {
		isDown = true;
	}

	override function OnMouseUp () {
		isTicked = !isTicked;
		
		OnMouseCancel ();
	}

	
	////////////////
	// Rects
	////////////////	
	private function GetTickRect () : Rect {
		return new Rect ( drawRct.x + drawRct.width - drawRct.height, drawRct.y, drawRct.height, drawRct.height );
	}


	////////////////
	// Update
	////////////////	
	override function UpdateWidget () {
		// Persistent vars
		isSelectable = true;
		
		// Mouse	
		mouseRct = drawRct;
	}


	////////////////
	// Draw
	////////////////	
	override function DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( GetTickRect(), isDown ? styles.active : styles.basic, drawDepth, tint, clipTo );

		if ( isTicked ) {
			OGDrawHelper.DrawSprite ( GetTickRect(), styles.ticked, drawDepth, tint, clipTo );
		}
	}

	override function DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, drawDepth, tint, clipTo );
	}
}

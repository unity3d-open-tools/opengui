using UnityEngine;
using System.Collections;

public class OGTickBox : OGWidget {
	public string text;
	public bool isTicked;
	
	private bool isDown = false;

	
	////////////////
	// Interaction
	////////////////	
	override public void OnMouseCancel () {
		isDown = false;
		root.ReleaseWidget ();
	}
	
	override public void OnMouseDown () {
		isDown = true;
	}

	override public void OnMouseUp () {
		isTicked = !isTicked;
		
		OnMouseCancel ();
	}

	
	////////////////
	// Rects
	////////////////	
	private Rect GetTickRect () {
		return new Rect ( drawRct.x + drawRct.width - drawRct.height, drawRct.y, drawRct.height, drawRct.height );
	}


	////////////////
	// Update
	////////////////	
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;
		
		// Mouse	
		mouseRct = drawRct;
	}


	////////////////
	// Draw
	////////////////	
	override public void DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( GetTickRect(), isDown ? styles.active : styles.basic, drawDepth, tint, clipTo );

		if ( isTicked ) {
			OGDrawHelper.DrawSprite ( GetTickRect(), styles.ticked, drawDepth, tint, clipTo );
		}
	}

	override public void DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, drawDepth, tint, clipTo );
	}
}

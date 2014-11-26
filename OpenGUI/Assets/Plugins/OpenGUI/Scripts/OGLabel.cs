using UnityEngine;
using System.Collections;

public class OGLabel : OGWidget {
	public string text = "";
	public bool overrideFontSize = false;
	public int fontSize;
	public bool overrideAlignment = false;
	public TextAnchor alignment;

	[HideInInspector] public float lineWidth = 0;
	

	/////////////////
	// Update
	/////////////////
	override public void UpdateWidget () {
		// Update data
		if ( !overrideFontSize ) {
			fontSize = styles.basic.text.fontSize;
		}

		if ( !overrideAlignment ) {
			alignment = styles.basic.text.alignment;
		}

		// Mouse
		mouseRct = drawRct;
	}


	//////////////////
	// Draw
	//////////////////	
	override public void DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, styles.basic.text, fontSize, alignment, drawDepth, tint, clipTo, null );
	}
}

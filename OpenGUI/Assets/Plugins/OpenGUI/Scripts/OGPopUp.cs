using UnityEngine;
using System.Collections;

public class OGPopUp : OGWidget {	
	public string title = "";
	public string[] options;
	public string selectedOption;
	public GameObject target;
	public string message;
	public bool passSelectedOption = false;
	public bool isUp = false;
	
	private float timeStamp;
	
	
	////////////////////
	// Data
	////////////////////
	public int selectedIndex {
		get {
			for ( int i = 0; i < options.Length; i++ ) {
				if ( selectedOption == options[i] ) {
					return i;
				}
			}

			return 0;
		}
	}


	////////////////////
	// Options
	////////////////////
	private Rect GetOptionRect ( int i ) {
		float bottom = drawRct.y - options.Length * drawRct.height;
		float top = drawRct.y + options.Length * drawRct.height;

		if ( bottom < 0 || clipTo && bottom < clipTo.drawRct.y ) {
			return new Rect ( drawRct.x, top - ( i * ( drawRct.height + styles.active.text.padding.bottom ) ), drawRct.width, drawRct.height );
		} else {
			return new Rect ( drawRct.x, drawRct.y - ( ( 1 + i ) * drawRct.height ), drawRct.width, drawRct.height );
		}
	}
	
	private OGStyle GetOptionStyle ( int i ) {
		return ( CheckMouseOver ( GetOptionRect ( i ) ) ) ? styles.hover : styles.active;
	}

	private int GetMouseOverOption () {
		for ( int i = 0; i < options.Length; i++ ) {
			if ( CheckMouseOver ( GetOptionRect ( i ) ) ) {
				return i;
			}
		}
		
		return -1;
	}

	private Rect GetThumbRect () {
		return new Rect ( drawRct.x + drawRct.width - drawRct.height - styles.basic.text.padding.right, drawRct.y, drawRct.height, drawRct.height );
	}

	private Rect GetExpandedRect () {
		float totalHeight = styles.active.text.padding.bottom + styles.active.text.padding.top + drawRct.height + options.Length * drawRct.height;
		float bottom = drawRct.y - totalHeight + drawRct.height;
		
		if ( bottom < 0 || clipTo && bottom < clipTo.drawRct.y ) {
			return new Rect ( drawRct.x, drawRct.y, drawRct.width, totalHeight );
		} else {
			return new Rect ( drawRct.x, bottom, drawRct.width, totalHeight );
		}
	}

	public void SetOptions ( string[] list ) {
		options = list;
	}

	
	////////////////////
	// Interaction
	////////////////////
	override public void OnMouseUp () {
		int mouseOverOption = GetMouseOverOption ();
	
		if ( Time.time - timeStamp > 0.5 || mouseOverOption != -1 ) {
			OnMouseCancel ();
		}
		
		if ( mouseOverOption != -1 ) {
			selectedOption = options[mouseOverOption];

			if ( target != null && !string.IsNullOrEmpty ( message ) ) {
				if ( passSelectedOption ) {
					target.SendMessage ( message, selectedOption );
				} else {
					target.SendMessage ( message );
				}
			}	
		
			isUp = false;
		}
	}
	
	override public void OnMouseDown () {
		if ( !isUp && GetMouseOverOption() == -1 ) {		
			isUp = true;
			timeStamp = Time.time;
		}
	}
	
	override public void OnMouseCancel () {
		isUp = false;
		
		OGRoot.GetInstance().ReleaseWidget ();
	}


	////////////////////
	// Update
	////////////////////
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;
		
		// Update data
		isAlwaysOnTop = isUp;

		// Mouse
		if ( isUp ) {
			mouseRct = GetExpandedRect ();
		} else {
			mouseRct = drawRct;
		}

		// Styles
		if ( isUp ) {
			currentStyle = styles.active;
		} else {
			currentStyle = styles.basic;
		}
	}


	///////////////////
	// Draw
	///////////////////
	override public void DrawSkin () {
		if ( isUp ) {
			OGDrawHelper.DrawSlicedSprite ( GetExpandedRect(), currentStyle, drawDepth, tint, clipTo );
			
			for ( int i = 0; i < options.Length; i++ ) {
				if ( GetOptionStyle ( i ) == styles.hover ) {
					OGDrawHelper.DrawSprite ( GetOptionRect ( i ), styles.hover, drawDepth, tint, clipTo );
				}
			}

		} else {
			OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
			OGDrawHelper.DrawSprite ( GetThumbRect (), styles.thumb, drawDepth, tint, clipTo );
		}
	}	
	
	override public void DrawText () {
		if ( isUp ) {
			OGDrawHelper.DrawLabel ( drawRct, title, styles.basic.text, drawDepth, tint, clipTo );

			for ( int i = 0; i < options.Length; i++ ) {
				OGDrawHelper.DrawLabel ( GetOptionRect ( i ), options[i], GetOptionStyle ( i ).text, drawDepth, tint, clipTo );
			}
		
		} else if ( !string.IsNullOrEmpty ( selectedOption ) ) {
			OGDrawHelper.DrawLabel ( drawRct, selectedOption, currentStyle.text, drawDepth, tint, clipTo );
			
		} else {
			OGDrawHelper.DrawLabel ( drawRct, title, currentStyle.text, drawDepth, tint, clipTo );
			
		}
	}
}

using UnityEngine;
using System.Collections;

public class OGListItem : OGWidget {
	public string text = "";
	public bool isSelected = false;
	public bool isTicked = false;
	public Object obj;
	public GameObject target;
	public string message;
	public string hoverMessage;
	public string argument;
	public OGRoot.OGDelegate func;
	public OGRoot.OGDelegate hoverFunc;


	//////////////////
	// Interaction
	//////////////////
	private void Select () {
		isSelected = true;

		foreach ( OGListItem li in this.transform.parent.GetComponentsInChildren<OGListItem>() ) {
			if ( li != this ) {
				li.isSelected = false;
			}
		}

		if ( hoverFunc != null ) {
			hoverFunc ();
		}

		if ( target != null ) {
			if ( !string.IsNullOrEmpty ( hoverMessage ) ) {
				if ( !string.IsNullOrEmpty ( argument ) ) {
					target.SendMessage ( hoverMessage, argument );
				
				} else if ( obj != null ) {
					target.SendMessage ( hoverMessage, obj );
				
				} else {
					target.SendMessage ( hoverMessage, this );

				}
			}
		}
	}

	private void Action () {
		if ( func != null ) {
			func ();
		}
		
		if ( target != null ) {
			if ( !string.IsNullOrEmpty ( message ) ) {
				if ( !string.IsNullOrEmpty ( argument ) ) {
					target.SendMessage ( message, argument );
				
				} else if ( obj != null ) {
					target.SendMessage ( message, obj );
				
				} else {
					target.SendMessage ( message, this );

				}
			}
		}
	}

	private void Tick () {
		isTicked = true;

		foreach ( OGListItem li in this.transform.parent.GetComponentsInChildren<OGListItem>() ) {
			if ( li != this ) {
				li.isTicked = false;
			}
		}
	}

	override public void OnMouseCancel () {
		isSelected = false;
	}

	override public void OnMouseDown () {
		if ( !isDisabled ) {
			Action ();
			Tick ();
		}
	}

	override public void OnMouseOver () {
		if ( !isSelected && !isDisabled  ) {
			Select ();
		}
	}


	//////////////////
	// Update
	//////////////////
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		// Mouse
		mouseRct = drawRct;

		// ^ Cancel check
		if ( !CheckMouseOver ( mouseRct ) ) { OnMouseCancel(); }
		
		// Styles
		if ( isSelected ) {
			currentStyle = this.styles.hover;
		} else if ( isTicked ) {
			currentStyle = this.styles.ticked;
		} else {
			currentStyle = this.styles.basic;
		}
	}

	//////////////////
	// Draw
	//////////////////
	override public void DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );
	}

	override public void DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, clipTo );
	}
}

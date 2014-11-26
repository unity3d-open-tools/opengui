using UnityEngine;
using System.Collections;

public class OGButton : OGWidget {
	public string hiddenString = "";
	public string text = "";
	public GameObject target = null;
	public string message = "";
	public string argument = "";
	public OGRoot.OGDelegate func = null;
	public System.Action action = null;
	public System.Action< string > actionWithArgument = null;
	public MonoBehaviour argumentSource = null;
	public string argumentSourceField = "";
	public bool enableImage = false;
	public Vector2 imageScale = Vector2.one;
	public Vector2 imageOffset = Vector2.zero;
	
	private bool isDown = false;

	
	////////////////////
	// Rects
	////////////////////
	private Rect GetImageRect () {
		return new Rect ( drawRct.x + ( drawRct.width / 2 ) - ( ( drawRct.width * imageScale.x ) / 2 ) + imageOffset.x, drawRct.y + ( drawRct.height / 2 ) - ( ( drawRct.height * imageScale.y ) / 2 ) - imageOffset.y, drawRct.width * imageScale.x, drawRct.height * imageScale.y );
	}


	////////////////////
	// Interact
	////////////////////
	override public void OnMouseUp () {
		if ( func != null ) {
			if ( !string.IsNullOrEmpty ( argument ) ) {
				func ( argument );
			
			} else {
				func ();

			}
		
		} else if ( action != null ) {
			action ();
	
		} else if ( actionWithArgument != null && !string.IsNullOrEmpty ( argument ) ) {
			actionWithArgument ( argument );
		
		} else if ( target != null && !string.IsNullOrEmpty ( message ) ) {
			// if the source widget and source field are set then we
			// get the argument from this
			if ( argumentSource != null && !string.IsNullOrEmpty( argumentSourceField ) ) {
				target.SendMessage( message, argumentSource.GetType().GetField( argumentSourceField ).GetValue( argumentSource ) );
			} else if ( !string.IsNullOrEmpty ( argument ) ) {
				target.SendMessage ( message, argument );
			} else {	
				target.SendMessage ( message, this );
			}

		} else {
			Debug.LogWarning ( "OGButton '" + this.gameObject.name + "' | Target/message missing!" );
		
		}

		OnMouseCancel ();
	}
	
	override public void OnMouseCancel () {
		isDown = false;
		root.ReleaseWidget ();
	}
	
	override public void OnMouseDown () {
		isDown = true;
	}
	

	////////////////////
	// Update
	////////////////////
	override public void UpdateWidget () {
		// Persistent vars
		isSelectable = true;

		// Styles
		if ( isDown ) {
			currentStyle = styles.active;
		} else if ( CheckMouseOver() ) {
			currentStyle = styles.hover;
		} else { 
			currentStyle = styles.basic;
		}

		// Mouse
		mouseRct = drawRct;
	}

	
	////////////////////
	// Draw
	////////////////////
	override public void DrawSkin () {
		if ( currentStyle == null ) { return; }
		
		OGDrawHelper.DrawSlicedSprite ( drawRct, currentStyle, drawDepth, tint, clipTo );

		if ( enableImage ) {
			OGDrawHelper.DrawSprite ( GetImageRect(), styles.thumb, drawDepth, tint, clipTo );
		}
	}

	override public void DrawText () {
		OGDrawHelper.DrawLabel ( drawRct, text, currentStyle.text, drawDepth, tint, clipTo );
	}
}

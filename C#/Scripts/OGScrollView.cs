using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[AddComponentMenu ("OpenGUI/ScrollView")]
public class OGScrollView : OGWidget {

	public bool  touchControl = false;
	public float scrollLength = 512;
	public float viewWidth = 100;
	public float viewHeight = 100;
	public bool alwaysVertical = false;
	public bool alwaysHorizontal = false;
	public float inset = 10;
	public Vector2 position = Vector2.zero;
		
	// Update
	public override void UpdateWidget (){		
		// Adopt view width and height from localScale
		if ( transform.localScale.x != 1 ) {
			viewWidth = transform.localScale.x;
		}
		
		if ( transform.localScale.y != 1 ) {
			viewHeight = transform.localScale.y;
		}
		
		transform.localScale = new Vector3 ( 1, 1, 1 );
		
		// Update content
		foreach ( OGWidget w in transform.GetComponentsInChildren<OGWidget>() ) {			
			if ( w != this ) {
				// Make sure the widgets aren't drawn automatically
				if ( !w.manualDraw ) {
					w.manualDraw = true;
				}
			
				// Update the scroll length
				if ( scrollLength < w.gameObject.transform.localPosition.y + w.gameObject.transform.localScale.y + inset ) {
					scrollLength = w.gameObject.transform.localPosition.y + w.gameObject.transform.localScale.y + inset;
				}
				else {
					scrollLength = viewHeight;
				}
			}
		}
		
		// Touch control
		if ( touchControl && colliderRect.Contains ( Input.mousePosition ) ) {
			if ( Input.GetMouseButton ( 0 ) ) {
				position.x = Input.mousePosition.x - transform.position.x;
				position.y = Input.mousePosition.y - transform.position.y;
			} 
		}
	}
	
	// Draw
	public override void Draw (  float x ,   float y   ){
		colliderRect = new Rect ( transform.position.x, transform.position.y, viewWidth, viewHeight );
		
		// Start scroll view
		position = GUI.BeginScrollView ( new Rect( x, y, viewWidth, viewHeight ),
			position,
			new Rect ( -inset, -inset, viewWidth - ( inset * 2 ), scrollLength ),
			alwaysHorizontal,
			alwaysVertical
		);
		
		// Queue up widgets for drawing
		var queue = new List<List<OGWidget>>();

		// ^ create 30 batches
		for ( int k = 0; k < 30; k++ ) {
			queue.Add ( new List<OGWidget>() );
		}
		
		// ^ put widgets into their batches
		foreach ( OGWidget w in transform.GetComponentsInChildren<OGWidget>() ) {
			if ( w != this ) {
				// Queue index is based on the Z position
				int index = (int)w.transform.localPosition.z;
				int count = queue.Count;
				
				// Make sure the index is between 0 and the amount of batches in the queue
				if ( index > 0 ) { index = 0; }
				else { index = Mathf.Abs( index ); }																																																										
				if ( index >= count ) { index = count - 1; }
				
				// Add the widget to the batch
				queue[index].Add ( w );
			}
		}
	
		// Draw widgets
		for ( int i = 0; i < queue.Count; i++ ) {
			foreach ( OGWidget item in queue[i] ) {
				item.Draw ( item.transform.position.x - transform.position.x + item.adjustPivot.x, item.transform.position.y - transform.position.y + item.adjustPivot.y );
			}
		}
	
		// End scroll view
		GUI.EndScrollView();

	}
}

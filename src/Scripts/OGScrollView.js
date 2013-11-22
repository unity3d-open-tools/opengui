#pragma strict

@script AddComponentMenu ("OpenGUI/ScrollView")

class OGScrollView extends OGWidget {
	var touchControl : boolean = false;
	var scrollLength : float = 512;
	var scrollWidth : float = 512;
	var viewWidth : float = 100;
	var viewHeight : float = 100;
	var alwaysVertical = false;
	var alwaysHorizontal = false;
	var inset : float = 10;
	var position : Vector2 = Vector2.zero;
		
	// Update
	override function UpdateWidget () {		
		// Adopt view width and height from localScale
		if ( transform.localScale.x != 1 ) {
			viewWidth = transform.localScale.x;
		}
		
		if ( transform.localScale.y != 1 ) {
			viewHeight = transform.localScale.y;
		}
		
		if ( scrollWidth < viewWidth - ( inset * 2 ) ) {
			scrollWidth = viewWidth - ( inset * 2 );
		}
		
		if ( scrollLength < viewHeight - ( inset * 2 ) ) {
			scrollLength = viewHeight - ( inset * 2 );
		}
		
		transform.localScale = new Vector3 ( 1, 1, 1 );
		
		// Update content
		for ( var c : Component in transform.GetComponentsInChildren (OGWidget) ) {			
			var w : OGWidget = c as OGWidget;
			
			if ( w != this ) {
				// Make sure the widgets aren't drawn automatically
				if ( !w.manualDraw ) {
					w.manualDraw = true;
				}
			
				// Update the scroll area
				if ( scrollLength < w.gameObject.transform.position.y + w.gameObject.transform.localScale.y + inset ) {
					scrollLength = w.gameObject.transform.position.y + w.gameObject.transform.localScale.y + inset;
				}
				
				if ( scrollWidth < w.gameObject.transform.localPosition.x + w.gameObject.transform.localScale.x + inset ) {
					scrollWidth = w.gameObject.transform.localPosition.x + w.gameObject.transform.localScale.x + inset;
				}
			}
		}
		
		// Drag control
		if ( colliderRect.Contains ( Input.mousePosition ) ) {
			if ( Input.GetMouseButton ( 2 ) ) {
				position.x -= Input.GetAxis("Mouse X") * 18;
				position.y += Input.GetAxis("Mouse Y") * 18;
			} 
		}
	}
	
	// Draw
	override function Draw ( x : float, y : float ) {
		colliderRect = new Rect ( transform.position.x, transform.position.y, viewWidth, viewHeight );
		
		// Start scroll view
		position = GUI.BeginScrollView (
			Rect ( x, y, viewWidth, viewHeight ),
			position,
			Rect ( -inset, -inset, scrollWidth, scrollLength ),
			alwaysHorizontal,
			alwaysVertical
		);
		
		// Queue up widgets for drawing
		var queue : List.< List.< OGWidget > > = new List.< List.< OGWidget > >();
		
		// ^ create 30 batches
		for ( var k = 0; k < 30; k++ ) {
			queue.Add ( new List.< OGWidget >() );
		}
		
		// ^ put widgets into their batches
		for ( var c : Component in transform.GetComponentsInChildren (OGWidget) ) {
			var w : OGWidget = c as OGWidget;
			
			if ( w != this ) {
				// Queue index is based on the Z position
				var index : int = w.transform.localPosition.z;
				var count : int = queue.Count;
				
				// Make sure the index is between 0 and the amount of batches in the queue
				if ( index > 0 ) { index = 0; }
				else { index = Mathf.Abs( index ); }																																																										
				if ( index >= count ) { index = count - 1; }
				
				// Add the widget to the batch
				queue[index].Add ( w );
			}
		}
	
		// Draw widgets
		for ( var i = 0; i < queue.Count; i++ ) {
			for ( var item : OGWidget in queue[i] ) {
				if ( item != null ) {
					item.Draw ( item.transform.position.x - transform.position.x + item.adjustPivot.x, item.transform.position.y - transform.position.y + item.adjustPivot.y );
				}
			}
		}
	
		// End scroll view
		GUI.EndScrollView();

	}
}
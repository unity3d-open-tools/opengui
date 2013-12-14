#pragma strict

class OGListItem extends OGWidget {
	public var text : String = "";
	public var selected : boolean = false;
	public var object : Object;
	public var target : GameObject;
	public var message : String;
	public var argument : String;

	private var background : OGSprite;
	private var label : OGLabel;

	private function Action () {
		if ( target != null ) {
			if ( !String.IsNullOrEmpty ( message ) ) {
				if ( !String.IsNullOrEmpty ( argument ) ) {
					target.SendMessage ( message, argument );
				
				} else if ( object != null ) {
					target.SendMessage ( message, object );
				
				} else {
					target.SendMessage ( message, this );

				}
			}
		}
	}

	override function OnMouseCancel () {
		OGRoot.GetInstance().ReleaseWidget ();
	}

	override function OnMouseDown () {
		selected = true;

		if ( !Input.GetKeyDown ( KeyCode.LeftShift ) ) {
			for ( var li : OGListItem in this.transform.parent.GetComponentsInChildren.<OGListItem>() ) {
				if ( li != this ) {
					li.selected = false;
				}
			}
		}

		Action ();
		SetDirty();
	}
	
	override function UpdateWidget () {
		selectable = true;
		
		// Background		
		if ( background == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGSprite ) ) {
				background = this.gameObject.GetComponentInChildren ( OGSprite );
				
			} else {			
				var newSprite : OGSprite = new GameObject ( "Sprite", OGSprite ).GetComponent ( OGSprite );
				newSprite.transform.parent = this.transform;
				newSprite.styles.basic = this.styles.basic;
				
				UpdateWidget ();
				return;
			}

		} else {
			background.transform.localScale = Vector3.one;
			background.transform.localEulerAngles = Vector3.zero;
			background.transform.localPosition = Vector3.zero;
		
			background.isDrawn = isDrawn;
			background.hidden = true;
			
			if ( selected ) {
				background.styles.basic = this.styles.active;
			
			} else if ( disabled ) {
				background.styles.basic = this.styles.disabled;

			} else {
				background.styles.basic = this.styles.basic;
			
			}

			mouseRct = background.drawRct;
		}
		
		// Label
		if ( label == null ) {
			if ( this.gameObject.GetComponentInChildren ( OGLabel ) ) {
				label = this.gameObject.GetComponentInChildren ( OGLabel );
				
			} else {				
				var newLabel : OGLabel = new GameObject ( "Label", OGLabel ).GetComponent ( OGLabel );
				newLabel.transform.parent = this.transform;
				newLabel.text = text;
				newLabel.styles.basic = this.styles.basic;

				UpdateWidget ();
				return;
			}
		
		} else {
			label.text = text;
			label.transform.localScale = Vector3.one;
			label.transform.localEulerAngles = Vector3.zero;
			label.transform.localPosition = Vector3.zero;
			
			label.isDrawn = isDrawn;
			label.hidden = true;
			
			if ( selected ) {
				label.styles.basic = this.styles.active;
			
			} else if ( disabled ) {
				label.styles.basic = this.styles.disabled;
			
			} else {
				label.styles.basic = this.styles.basic;
			}
		}
	}
}

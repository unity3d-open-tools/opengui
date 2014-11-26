using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class OGTabs : OGWidget {
	[System.Serializable]
	public class Tab {
		public string title = "Tab";
		public GameObject content;
	
		public Tab ( string title, GameObject content ) {
			this.title = title;
			this.content = content;
		}
	}
	
	public int activeTab;
	public string leftArrow = "«";
	public string rightArrow = "»";
	public List<Tab> tabs = new List<Tab>();
	public GameObject target;
	public string message;
	public string argument;
	public bool passSelectedTab = false;

	private bool overflow = false;
	private int maxTabs = 0;
	private int focusTab = 0;
	private bool leftNavDown = false;
	private bool rightNavDown = false;


	//////////////////
	// Rects
	//////////////////
	private float GetTotalWidth () {
		float width = 0f;
		float widestTab = 0f;

		for ( int i = 0; i < tabs.Count; i++ ) {
			float newWidth = OGDrawHelper.GetLabelWidth ( tabs[i].title, GetTabStyle ( i ).text );
			width += newWidth;

			if ( newWidth > widestTab ) {
				widestTab = newWidth;
			}
		}

		if ( width > drawRct.width ) {
			maxTabs = (int) Mathf.Clamp ( Mathf.Floor ( drawRct.width / widestTab ), 1f, tabs.Count );
		
		} else {
			maxTabs = tabs.Count;

		}

		return width;
	}
	
	private Rect GetTabRect ( int i ) {
		float tabWidth;
		
		if ( !overflow ) {
	       		tabWidth = drawRct.width / tabs.Count;

		} else {
			float width = drawRct.width;
			
			if ( activeTab > 0 ) {
				width -= drawRct.height;
			}
			
			if ( activeTab < tabs.Count - 1 ) {
				width -= drawRct.height;
			}

			tabWidth = width / maxTabs;
		
		}
		
		Rect rect = new Rect ( drawRct.x + tabWidth * ( i - focusTab ), drawRct.y, tabWidth, drawRct.height );
		
		if ( activeTab > 0 && overflow ) {
			rect.x += drawRct.height;
		}

		return rect;
	}

	private Rect GetLeftRect () {
		return new Rect ( drawRct.x, drawRct.y, drawRct.height, drawRct.height );
	}
	
	private Rect GetRightRect () {
		return new Rect ( drawRct.xMax - drawRct.height, drawRct.y, drawRct.height, drawRct.height );
	}

	
	//////////////////
	// Styles
	//////////////////
	private OGStyle GetTabStyle ( int i ) {
		if ( i == activeTab ) {
			return styles.active;
		} else {
			return styles.basic;
		}
	}


	//////////////////
	// Management
	//////////////////
	public void AddTab ( string tabName, GameObject tabObject, bool switchTo ) {
		Tab newTab = new Tab ( tabName, tabObject );

		tabs.Add ( newTab );

		if ( switchTo ) {
			SetActiveTab ( tabs.Count - 1 );
		} else if ( tabs.Count < 2 ) {
			SetActiveTab ( 0 );
		}
	}

	public void ClearTabs () {
		tabs.Clear ();
		activeTab = -1;
	}

	public void SetActiveTab ( string n ) {
		SetActiveTab ( int.Parse ( n ) );
	}

	public void SetActiveTab ( int tab ) {
		activeTab = tab;
		
		for ( int i = 0; i < tabs.Count; i++ ) {
			if ( tabs[i].content ) {
				tabs[i].content.SetActive ( i == activeTab );
			}
		}
	}
	
	
	//////////////////
	// Mouse
	//////////////////
	override public void OnMouseDown () {
		if ( CheckMouseOver ( GetLeftRect () ) && activeTab > 0 ) {
			leftNavDown = true;

		} else if ( CheckMouseOver ( GetRightRect () ) && activeTab < tabs.Count - 1 ) {
			rightNavDown = true;

		} else {
			for ( int i = 0; i < tabs.Count; i++ ) {
				if ( CheckMouseOver ( GetTabRect ( i ) ) ) {
					SetActiveTab ( i );

					if ( target && !string.IsNullOrEmpty ( message ) ) {
						if ( passSelectedTab ) {
							target.SendMessage ( message, i );

						} else if ( !string.IsNullOrEmpty ( argument ) ) {
							target.SendMessage ( message, argument );

						} else {
							target.SendMessage ( message );

						}
					}
				}
			}
		}
	}

	override public void OnMouseUp () {
		if ( leftNavDown ) {
			SetActiveTab ( activeTab - 1 );
		
		} else if ( rightNavDown ) {
			SetActiveTab ( activeTab + 1 );

		}
		
		OnMouseCancel ();
	}

	override public void OnMouseCancel () {
		leftNavDown = false;
		rightNavDown = false;

		root.ReleaseWidget();
	}
	

	//////////////////
	// Update
	//////////////////
	override public void UpdateWidget () {
		isSelectable = true;
	
		// Mouse
		mouseRct = drawRct;

		// Update data
		overflow = GetTotalWidth () > drawRct.width;
		
		if ( activeTab >= tabs.Count && tabs.Count > 0 ) {
			SetActiveTab ( tabs.Count - 1 );
	 	}

		if ( !overflow ) {
			focusTab = 0;

		} else if ( activeTab < focusTab ) {
			focusTab--;
		
		} else if ( activeTab >= focusTab + maxTabs ) {
			focusTab++;

		}
	}

	
	//////////////////
	// Draw
	//////////////////
	override public void DrawSkin () {
		for ( int i = focusTab; i < focusTab + maxTabs; i++ ) {
			OGDrawHelper.DrawSlicedSprite ( GetTabRect(i), GetTabStyle(i), drawDepth, tint, clipTo );
		}
		
		if ( overflow ) {
			if ( activeTab > 0 ) {
				OGDrawHelper.DrawSlicedSprite ( GetLeftRect (), styles.thumb, drawDepth, tint, clipTo );
			}
			
			if ( activeTab < tabs.Count - 1 ) {
				OGDrawHelper.DrawSlicedSprite ( GetRightRect (), styles.thumb, drawDepth, tint, clipTo );
			}
		}
	}

	override public void DrawText () {
		for ( int i = focusTab; i < focusTab + maxTabs; i++ ) {
			OGDrawHelper.DrawLabel ( GetTabRect ( i ), tabs[i].title, GetTabStyle(i).text, drawDepth, tint, clipTo );
		}
		
		if ( overflow ) {
			if ( activeTab > 0 ) {
				OGDrawHelper.DrawLabel ( GetLeftRect (), leftArrow, styles.thumb.text, drawDepth, tint, clipTo );
			}

			if ( activeTab < tabs.Count - 1 ) {
				OGDrawHelper.DrawLabel ( GetRightRect (), rightArrow, styles.thumb.text, drawDepth, tint, clipTo );
			}
		}
		
	}
}

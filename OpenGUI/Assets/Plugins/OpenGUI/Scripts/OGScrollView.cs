using UnityEngine;
using System.Collections;

public class OGScrollView : OGWidget {
	public enum ScrollDirection {
		None,
		X,
		Y
	}

	public enum ScrollbarVisibility {
		Hidden,
		Auto
	}

	public bool touchControl = false;
	public bool infiniteScrolling = false;
	public ScrollDirection lockAxis;
	public ScrollbarVisibility scrollbarVisibility = ScrollbarVisibility.Auto;
	public Vector2 size;
	public Vector2 position;
	public Vector2 padding = new Vector2 ( 10, 10 );
	public float elasticity = 2;
	public Vector2 thumbScale = new Vector2 ( 16, 1 );

	private OGWidget[] widgets;
	private Vector2 bounds;
	private bool inPlace = true;

	
	////////////////
	// Rects
	////////////////
	private Rect GetScrollbarYRect () {
		Vector2 size = new Vector2 ( thumbScale.x, ( drawRct.height + bounds.y ) * thumbScale.y );
		Vector2 pos = new Vector2 ( drawRct.xMax - thumbScale.x, drawRct.yMax - size.y );
		float percentage = Mathf.Clamp ( position.y, bounds.y, 0 ) / bounds.y;
		
		pos.y -= percentage * ( drawRct.height - size.y );

		return new Rect ( pos.x, pos.y, size.x, size.y );
	}
	
	private Rect GetScrollbarXRect () {
		Vector2 size = new Vector2 ( ( drawRct.width + bounds.x ) * thumbScale.y, thumbScale.x );
		Vector2 pos = new Vector2 ( drawRct.xMin, drawRct.yMin );
		float percentage = Mathf.Clamp ( position.x, bounds.x, 0 ) / bounds.x;
		
		pos.x += percentage * ( drawRct.width - size.x );

		return new Rect ( pos.x, pos.y, size.x, size.y );
	}


	////////////////
	// Update
	////////////////
	private void UpdateChildren () {
		widgets = this.gameObject.GetComponentsInChildren<OGWidget>();

		bounds = Vector2.zero;
		
		for ( int i = 0; i < widgets.Length; i++ ) {
			OGWidget w = widgets[i];
		
			if ( w != null && w != this ) {
				w.scrollOffset = new Vector3 ( padding.x + position.x, padding.y + position.y, 0 );
				
				// Reposition for infinite scrolling
				CheckWidgetOffset ( w );

				w.anchor.x = RelativeX.None;
				w.anchor.y = RelativeY.None;
				w.clipTo = this;

				float bottom = w.transform.position.y - this.transform.position.y + w.transform.localScale.y - size.y + padding.y * 2;
				float right = w.transform.position.x - this.transform.position.x + w.transform.localScale.x - size.x + padding.x * 2;

				if ( -bottom < bounds.y ) {
					bounds.y = -bottom;
				}

				if ( -right < bounds.x ) {
					bounds.x = -right;
				}
			}
		}
	}

	private IEnumerator SnapBack () {
		inPlace = false;

		bool xInPlace = false;
		bool yInPlace = false;

		// If the scoll position is not in place, keep going
		while ( !inPlace ) {
			// Out of bounds top
			if ( !IsInfiniteY() && position.y > 0 ) {
				position.y = Mathf.Lerp ( position.y, 0, Time.deltaTime * padding.y );
				yInPlace = false;

				if ( position.y < 1 ) {
					position.y = 0;
				}
			
			// Out of bounds bottom
			} else if ( !IsInfiniteY() && position.y < bounds.y ) {
				position.y = Mathf.Lerp ( position.y, bounds.y, Time.deltaTime * padding.y );
				yInPlace = false;

				if ( position.y > bounds.y - 1 ) {
					position.y = bounds.y;
				}

			} else {
				yInPlace = true;
			}
			
			// Out of bounds left
			if ( !IsInfiniteX() && position.x > 0 ) {
				position.x = Mathf.Lerp ( position.x, 0, Time.deltaTime * padding.x );
				xInPlace = false;

				if ( position.x < 1 ) {
					position.x = 0;
				}
			
			// Out of bounds right
			} else if ( !IsInfiniteX() && position.x < bounds.x ) {
				position.x = Mathf.Lerp ( position.x, bounds.x, Time.deltaTime * padding.x );
				xInPlace = false;

				if ( position.x > bounds.x - 1 ) {
					position.x = bounds.x;
				}
			
			} else {
				xInPlace = true;
			}

			if ( yInPlace && xInPlace ) {
				inPlace = true;
			}

			UpdateChildren();

			yield return null;
		}
	}

	private bool IsInfiniteX () {
		return infiniteScrolling && lockAxis == ScrollDirection.X;
	}

	private bool IsInfiniteY () {
		return infiniteScrolling && lockAxis == ScrollDirection.Y;
	}

	private void CheckPositionReset () {
		if ( IsInfiniteY() ) {
			// Top
			if ( position.y <= - ( drawRct.height + padding.y * 4 ) ) {
				position.y = 0;
		
			// Bottom
			} else if ( position.y >= drawRct.height + padding.y * 4 ) {
				position.y = 0;

			}
		}
		
		if ( IsInfiniteX() ) {
			// Left
			if ( position.x <= - ( drawRct.width + padding.x * 4 ) ) {
				position.x = 0;
		
			// Right
			} else if ( position.x >= drawRct.width + padding.x * 4 ) {
				position.x = 0;

			}
		}
	}

	private void CheckWidgetOffset ( OGWidget w ) {
		if ( IsInfiniteY() ) {
			// Top
			if ( position.y < bounds.y && w.transform.position.y + w.transform.localScale.y + w.scrollOffset.y <= this.transform.position.y ) {
				w.scrollOffset.y += drawRct.height + padding.y * 4;
			
			// Bottom
			} else if ( position.y > 0 && w.transform.position.y + w.scrollOffset.y >= this.transform.position.y + size.y ) {
				w.scrollOffset.y -= drawRct.height + padding.y * 4;

			}	
		}
		
		if ( IsInfiniteX() ) {
			// Right
			if ( position.x < bounds.x && w.transform.position.x + w.transform.localScale.x + w.scrollOffset.x <= this.transform.position.x ) {
				w.scrollOffset.x += drawRct.width + padding.x * 4;
			
			// Left
			} else if ( position.x > 0 && w.transform.position.x + w.scrollOffset.x >= this.transform.position.x + size.x ) {
				w.scrollOffset.x -= drawRct.width + padding.x * 4;

			}	
		}
	}


	//////////////////
	// Mouse
	//////////////////
	override public void OnMouseDrag () {
		Vector2 drag;
		Vector2 amount;
		
		drag.x = Input.GetAxis ( "Mouse X" ); 
		drag.y = Input.GetAxis ( "Mouse Y" );
		
		amount.x = Mathf.Floor ( drag.x * 12 );
		amount.y = -Mathf.Floor ( drag.y * 12 );
		
		// Elasticity
		if ( !IsInfiniteX() && lockAxis != ScrollDirection.Y ) {
			if ( position.x + amount.x > 0 ) {
				amount.x *= elasticity / ( elasticity * ( position.x + amount.x ) );
			} else if ( position.x + amount.x < bounds.x ) {
				amount.x *= elasticity / ( elasticity * ( bounds.x - ( position.x + amount.x ) ) );
			} 
		}

		if ( !IsInfiniteY() && lockAxis != ScrollDirection.X ) {
			if ( position.y + amount.y > 0 ) {
				amount.y *= elasticity / ( elasticity * ( position.y + amount.y ) );
			} else if ( position.y + amount.y < bounds.y ) {
				amount.y *= elasticity / ( elasticity * ( bounds.y - ( position.y + amount.y ) ) );
			} 
		}

		if ( lockAxis == ScrollDirection.X || lockAxis == ScrollDirection.None ) {
			position.x += amount.x;
		}

		if ( lockAxis == ScrollDirection.Y || lockAxis == ScrollDirection.None ) {
			position.y += amount.y;
		}

		CheckPositionReset();
	}

	override public void OnMouseCancel () {
		StartCoroutine ( SnapBack () );
	
		root.ReleaseWidget ();
	}

	override public void OnMouseUp () {
		StartCoroutine ( SnapBack () );
	
		root.ReleaseWidget ();
	}

	override public void OnMouseOver () {
		Vector2 amount = Vector2.zero;
		float scroll = Input.GetAxis ( "Mouse ScrollWheel" );

		if ( scroll > 0 && inPlace ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				if ( IsInfiniteX() || position.x > bounds.x ) {
					amount.x = -20;
				}
			} else {
				if ( IsInfiniteY() || position.y < 0 ) {
					amount.y = 20;
				}
			}
		
		} else if ( scroll < 0 && inPlace ) {
			if ( Input.GetKey ( KeyCode.LeftShift ) ) {
				if ( IsInfiniteX() || position.x < 0 ) {
					amount.x = 20;
				}
			} else {
				if ( IsInfiniteY() || position.y > bounds.y ) {
					amount.y = -20;
				}
			}
		}
		
		if ( lockAxis == ScrollDirection.X || lockAxis == ScrollDirection.None ) {
			position.x += amount.x;
		}

		if ( lockAxis == ScrollDirection.Y || lockAxis == ScrollDirection.None ) {
			position.y += amount.y;
		}

		CheckPositionReset ();
		UpdateChildren ();	
	}

	override public void UpdateWidget () {
		// Persistent vars
		if ( lockAxis == ScrollDirection.None ) {
			infiniteScrolling = false;
		}

		if ( thumbScale.y > 1 ) {
			thumbScale.y = 1;
		}

		isSelectable = true;
		
		// Mouse		
		mouseRct = drawRct;

		// Reset scale	
		this.transform.localScale = Vector3.one;
		
		// Update all widgets in scroll view
		UpdateChildren ();
	}
	
	override public void DrawSkin () {
		OGDrawHelper.DrawSlicedSprite ( drawRct, styles.basic, drawDepth - 10, tint );
	
		if ( scrollbarVisibility == ScrollbarVisibility.Auto ) {
			if ( bounds.x < 0 && !IsInfiniteX() && lockAxis != ScrollDirection.Y ) {
				OGDrawHelper.DrawSlicedSprite ( GetScrollbarXRect(), styles.thumb, drawDepth - 9, tint );
			}

			if ( bounds.y < 0 && !IsInfiniteY() && lockAxis != ScrollDirection.X ) {
				OGDrawHelper.DrawSlicedSprite ( GetScrollbarYRect(), styles.thumb, drawDepth - 9, tint );
			}
		}
	}
}

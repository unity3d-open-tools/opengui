using UnityEngine;
using System.Collections;
using System.Reflection;

public class OGTextEditor {
	public class ClipboardHelper {
		private static PropertyInfo m_systemCopyBufferProperty = null;
		
		private static PropertyInfo GetSystemCopyBufferProperty () {
			if ( m_systemCopyBufferProperty == null ) {
				System.Type T = typeof ( GUIUtility );
				m_systemCopyBufferProperty = T.GetProperty ( "systemCopyBuffer", BindingFlags.Static | BindingFlags.NonPublic );
				
				if ( m_systemCopyBufferProperty == null ) {
					Debug.LogError ( "Can't access internal member 'GUIUtility.systemCopyBuffer' it may have been removed / renamed" );
				}
			}

			return m_systemCopyBufferProperty;
		}

		public static string GetClipboard () {
			PropertyInfo P = GetSystemCopyBufferProperty ();
			return P.GetValue ( null, null ).ToString ();
		}

		public static void SetClipboard ( string val ) {
			PropertyInfo P = GetSystemCopyBufferProperty ();
			P.SetValue ( null, val, null );
		}
	}

	public bool enabled = false;
	public string str = "";
	public Vector2 cursorPos;
	public Vector2 cursorSelectPos;
	public Vector2 cursorSize = new Vector2 ( 2, 12 );
	public Rect cursorRect;
	public Rect[] selectionRects = new Rect[0];
	public int cursorIndex;
	public int cursorSelectIndex;
	public int delayUntilRepeat = 20;
	public int repeat = 10;
	public KeyCode exitKey = KeyCode.Escape;
	public System.Action exitAction;

	private ClipboardHelper clipboardHelper;

	private bool shiftPressed {
		get {
			return Input.GetKey ( KeyCode.LeftShift ) || Input.GetKey ( KeyCode.RightShift );
		}
	}

	private bool arrowPressed {
	       	get {	
			return Input.GetKey ( KeyCode.LeftArrow ) || Input.GetKey ( KeyCode.DownArrow ) || Input.GetKey ( KeyCode.UpArrow ) || Input.GetKey ( KeyCode.RightArrow );
		}
	}

	private bool ctrlOrCmdPressed {
		get {
			return Input.GetKey ( KeyCode.LeftControl ) || Input.GetKey ( KeyCode.LeftCommand ) || Input.GetKey ( KeyCode.RightControl ) || Input.GetKey ( KeyCode.RightCommand );
		}
	}

	private bool exitKeyPressed {
		get {
			return Input.GetKey ( exitKey );
		}
	}

	public void Backspace () {
		if ( cursorIndex >= 0 && str.Length > 0 ) {
			if ( cursorSelectIndex == cursorIndex ) {
				cursorIndex--;
			}
			
			str = str.Remove ( cursorIndex, cursorSelectIndex - cursorIndex );

			cursorSelectIndex = cursorIndex;
		}
	}
	
	public void Delete () {
		if ( cursorIndex < str.Length ) {
			if ( cursorSelectIndex == cursorIndex ) {
				cursorSelectIndex++;
			}
			
			str = str.Remove ( cursorIndex, cursorSelectIndex - cursorIndex );

			cursorSelectIndex = cursorIndex;
		}
	}

	public void InsertText ( string newText ) {
		if ( string.IsNullOrEmpty ( newText ) ) {
			return;
		}
		
		if ( cursorIndex != cursorSelectIndex ) {
			Backspace ();
		}
		
		if ( cursorIndex < str.Length ) {
			string before = str.Substring ( 0, cursorIndex );
			string after = str.Substring ( cursorIndex, str.Length - cursorIndex );
			str = before + newText + after;
		
		} else {
			str += newText;

		}

		cursorIndex += newText.Length;
		cursorSelectIndex = cursorIndex;
	}
	
	public void MoveUp () {
		MoveLeft ();
	}
	
	public void MoveDown () {
		MoveRight ();
	}
	
	public void MoveLeft () {
		if ( cursorIndex > 0 ) {
			if ( !shiftPressed ) {
				if ( cursorIndex != cursorSelectIndex ) {
					cursorSelectIndex = cursorIndex;
				
				} else {
					cursorIndex--;
					cursorSelectIndex = cursorIndex;
				}

			} else {
				cursorIndex--;

			}
		}
	}

	public void MoveRight () {
		if ( cursorIndex < str.Length ) {
			if ( !shiftPressed ) {
				if ( cursorIndex != cursorSelectIndex ) {
					cursorIndex = cursorSelectIndex;
				
				} else {
					cursorIndex++;
					cursorSelectIndex = cursorIndex;
				}

			} else {
				cursorSelectIndex++;

			}
		}
	}

	public string Update ( string text, Rect rect ) {
		str = text;
		string copyString = "";

		if ( Input.GetKeyDown ( KeyCode.Backspace ) ) {
			Backspace ();
		
		} else if ( Input.GetKeyDown ( KeyCode.Delete ) ) {
			Delete ();
		
		// Select all
		} else if ( ctrlOrCmdPressed && Input.GetKeyDown ( KeyCode.A ) ) {
			cursorIndex = 0;
			cursorSelectIndex = str.Length;

		// Paste
		} else if ( ctrlOrCmdPressed && Input.GetKeyDown ( KeyCode.V ) ) {
			InsertText ( ClipboardHelper.GetClipboard () );

		// Copy
		} else if ( ctrlOrCmdPressed && Input.GetKeyDown ( KeyCode.C ) ) {
			copyString = str.Substring ( cursorIndex, cursorSelectIndex - cursorIndex );

			if ( !string.IsNullOrEmpty ( copyString ) ) {
				ClipboardHelper.SetClipboard ( copyString );
			}
		
		// Cut	
		} else if ( ctrlOrCmdPressed && Input.GetKeyDown ( KeyCode.X ) ) {
			copyString = str.Substring ( cursorIndex, cursorSelectIndex - cursorIndex );

			if ( !string.IsNullOrEmpty ( copyString ) ) {
				ClipboardHelper.SetClipboard ( copyString );
				Backspace ();
			}

		} else if ( Input.GetKeyDown ( KeyCode.LeftArrow ) ) {
			MoveLeft ();
		
		} else if ( Input.GetKeyDown ( KeyCode.UpArrow ) ) {
			MoveUp ();
		
		} else if ( Input.GetKeyDown ( KeyCode.DownArrow ) ) {
			MoveDown ();
		
		} else if ( Input.GetKeyDown ( KeyCode.RightArrow ) ) {
			MoveRight ();
			
		} else if ( !ctrlOrCmdPressed ) {
			InsertText ( Input.inputString );
			
		}

		if ( cursorIndex != cursorSelectIndex ) {
			cursorRect = new Rect ( 0, 0, 0, 0 );
			
			int lines = (int)(( cursorSelectPos.y - cursorPos.y ) / cursorSize.y);

			lines++;

			selectionRects = new Rect[lines];

			for ( int i = 0; i < lines; i++ ) {
				if ( i < 1 ) {
					if ( lines > 1 ) {
						selectionRects[i] = new Rect ( cursorPos.x, cursorPos.y, rect.xMax - cursorPos.x, cursorSize.y );
					
					} else {
						selectionRects[i] = new Rect ( cursorPos.x, cursorPos.y, cursorSelectPos.x - cursorPos.x, cursorSize.y );

					}

				} else if ( i == lines ) {
					selectionRects[i] = new Rect ( rect.x, cursorPos.y + ( i * cursorSize.y ), cursorSelectPos.x - rect.x, cursorSize.y );

				} else {
					selectionRects[i] = new Rect ( rect.x, cursorPos.y + ( i * cursorSize.y ), rect.width, cursorSize.y );

				}
			}
			
		} else {
			cursorRect = new Rect ( cursorPos.x, cursorPos.y, cursorSize.x, cursorSize.y );
			selectionRects = new Rect[0];

		}


		return str;
	}
}


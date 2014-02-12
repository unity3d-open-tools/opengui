using UnityEngine;
using System.Collections;

public class MyPage : OGPage {

	// This is called when the page is switched to
	override public void StartPage () {
	
	}
	
	// This is called once per frame
	override public void UpdatePage () {
	
	}

	// This is called when the page is switched away from
	override public void ExitPage () {

	}

	// You must use a custom function to switch pages
	public void SwitchPage () {
		OGRoot.GetInstance().GoToPage ( "MyOtherPage" );
	}
}

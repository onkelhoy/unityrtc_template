using UnityEngine;
using TMPro;

public class MainMenu : MonoBehaviour
{
  public GameObject LobbyMenu;
  public TMP_InputField RoomInput;
  public TMP_InputField PasswordInput;
  public TMP_Text ErrorInfo;

  public void LoadLobby()
  {
    LobbyMenu.SetActive(true);
    gameObject.SetActive(false);
  }

  public void Connect()
  {
    ErrorInfo.text = "";
    RTC.connect(RoomInput.text, PasswordInput.text);
  }

  public void Create()
  {
    ErrorInfo.text = "";
    RTC.create(RoomInput.text, PasswordInput.text);
  }

  public void showError(string error)
  {
    ErrorInfo.text = error;
  }
}

using System;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;

public class LobbyMenu : MonoBehaviour
{
    private float Timer;
    private bool isPlaying = false;

    public TMP_Text ErrorInfo;
    public TMP_Text PlayerInfo;
    public TMP_Text ButtonText;

    private void LoadGameScene()
    {
        isPlaying = false;
        Timer = 0;
        SceneManager.LoadScene("Game");
    }

    // UI button click
    public void RequestStart()
    {
        ErrorInfo.text = "";
        RTC.Start(DateTime.UtcNow.ToString());
    }

    // Starting game
    public void StartGame(string strtimestamp)
    {
        DateTime timestamp = DateTime.Parse(strtimestamp);
        DateTime now = DateTime.UtcNow;
        TimeSpan diff = timestamp.Subtract(now);

        Timer = diff.Milliseconds;
        isPlaying = true;
    }

    public void showError(string error)
    {
        ErrorInfo.text = error;
    }

    public void Update()
    {
        if (isPlaying)
        {
            Timer += Time.deltaTime;
            int seconds = Mathf.FloorToInt(Timer % 60f);

            ButtonText.text = string.Format("Starting game in {0}", 10 - seconds);

            if (seconds >= 10)
            {
                LoadGameScene();
            }
        }
    }
}

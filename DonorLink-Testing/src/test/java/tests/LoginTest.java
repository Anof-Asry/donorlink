package tests;

import base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

@Test
public void verifySuccessfulLogin() {

    driver.get("http://localhost:5173/login");

    driver.findElement(By.id("login-email"))
            .sendKeys("anofasry@gmail.com");

    driver.findElement(By.id("login-password"))
            .sendKeys("asry12");

    driver.findElement(By.id("login-submit-btn")).click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

    wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//*[contains(text(),'Sign Out')]")));

    Assert.assertTrue(driver.getPageSource().contains("Sign Out"));

    System.out.println("PASS: Login successful!");
}

@Test
public void verifyInvalidLogin() {

    driver.get("http://localhost:5173/login");

    driver.findElement(By.id("login-email"))
            .sendKeys("invaliduser@gmail.com");

    driver.findElement(By.id("login-password"))
            .sendKeys("WrongPassword123");

    driver.findElement(By.id("login-submit-btn")).click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    WebElement errorMessage = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                    By.xpath("//*[contains(text(),'Invalid email or password.')]")));

    Assert.assertTrue(errorMessage.isDisplayed());

    System.out.println("PASS: Invalid login error verified!");
}

@Test
public void verifyEmptyLoginFields() {


driver.get("http://localhost:5173/login");

driver.findElement(By.id("login-submit-btn")).click();

WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

WebElement errorMessage = wait.until(
        ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(text(),'Email and password are required.')]")));

Assert.assertTrue(errorMessage.isDisplayed());

System.out.println("PASS: Empty login validation works!");


}




}

package tests;

import base.BaseTest;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

public class SignupTest extends BaseTest {


@Test
public void verifySignupFormValidation() {

    driver.get("http://localhost:5173/signup");

    driver.findElement(By.id("signup-submit-btn")).click();

    String pageText =
            driver.findElement(By.tagName("body")).getText();

    Assert.assertTrue(pageText.contains("Full name is required."));
    Assert.assertTrue(pageText.contains("Email is required."));
    Assert.assertTrue(pageText.contains("Phone number is required."));
    Assert.assertTrue(pageText.contains("Password is required."));
    Assert.assertTrue(pageText.contains("Please confirm your password."));

    System.out.println("PASS: Signup validation works!");
}

@Test
public void verifySuccessfulSignup() {


driver.get("http://localhost:5173/signup");

String uniqueEmail =
        "selenium" + System.currentTimeMillis() + "@gmail.com";

driver.findElement(By.id("signup-fullname"))
        .sendKeys("Selenium Test User");

driver.findElement(By.id("signup-email"))
        .sendKeys(uniqueEmail);

driver.findElement(By.id("signup-phone"))
        .sendKeys("0771234567");

driver.findElement(By.id("signup-password"))
        .sendKeys("Test@12345");

driver.findElements(By.cssSelector("input[type='password']"))
        .get(1).sendKeys("Test@12345");

driver.findElement(By.id("signup-submit-btn")).click();

org.openqa.selenium.support.ui.WebDriverWait wait =
        new org.openqa.selenium.support.ui.WebDriverWait(
                driver,
                java.time.Duration.ofSeconds(15)
        );

wait.until(d ->
        d.findElements(By.xpath(
                "//*[normalize-space(text())='Sign Out']"
        )).stream().anyMatch(WebElement::isDisplayed)
);

Assert.assertTrue(
        driver.getCurrentUrl().equals("http://localhost:5173/"),
        "User was not redirected to the home page"
);

Assert.assertTrue(
        driver.findElement(By.xpath(
                "//*[normalize-space(text())='Sign Out']"
        )).isDisplayed(),
        "User was not automatically logged in"
);

System.out.println("PASS: Signup successful!");
System.out.println("PASS: Automatic login verified!");
System.out.println("PASS: Redirected to home page!");
System.out.println("Registered email: " + uniqueEmail);


}




}

package tests;

import base.BaseTest;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.time.Duration;

public class DonorManagementTest extends BaseTest {

    private final String email = "anofasry@gmail.com";
    private final String password = "asry12";

    private WebDriverWait wait;

    private void loginAndOpenDonors() {

        wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        driver.get("http://localhost:5173/login");

        driver.findElement(By.id("login-email")).sendKeys(email);
        driver.findElement(By.id("login-password")).sendKeys(password);

        driver.findElement(By.id("login-submit-btn")).click();

        wait.until(ExpectedConditions.urlToBe("http://localhost:5173/"));

        driver.get("http://localhost:5173/donors");

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("table")
        ));

        System.out.println("===== DONOR PAGE DEBUG =====");

System.out.println("BUTTONS:");

for (WebElement button : driver.findElements(By.tagName("button"))) {
    System.out.println("Button text: [" + button.getText() + "]");
}

System.out.println("INPUTS:");

for (WebElement input : driver.findElements(By.tagName("input"))) {
    System.out.println(
        "Input name: " + input.getAttribute("name")
        + " | Placeholder: " + input.getAttribute("placeholder")
    );
}

System.out.println("============================");
    }

    // Open Add Donor form if it is not already open
    private void openDonorForm() {

    if (driver.findElements(By.cssSelector("input[name='name']"))
            .isEmpty()) {

        driver.findElement(
                By.xpath("//button[contains(normalize-space(), 'Add Donor')]")
        ).click();
    }

    wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("input[name='name']")
    ));

    wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//button[normalize-space()='Create Donor']")
    ));
}

    // TEST 1: Verify donor list
    @Test
    public void verifyDonorListDisplayed() {

        loginAndOpenDonors();

        WebElement table = driver.findElement(By.cssSelector("table"));

        Assert.assertTrue(table.isDisplayed());

        Assert.assertTrue(
                table.getText().contains("Name"),
                "Donor table headers were not displayed."
        );

        System.out.println("PASS: Donor list is displayed!");
    }

    // TEST 2: Successfully add a donor
    @Test
public void verifySuccessfulDonorCreation() {

    loginAndOpenDonors();

    openDonorForm();

    String timestamp = String.valueOf(System.currentTimeMillis());

    String donorName = "Selenium Donor " + timestamp;

    // Generate a unique 10-digit contact number
    String contact = "077" +
            timestamp.substring(timestamp.length() - 7);

    driver.findElement(By.name("name")).sendKeys(donorName);

    new Select(driver.findElement(By.name("bloodGroup")))
            .selectByVisibleText("O+");

    driver.findElement(By.name("age")).sendKeys("25");

    driver.findElement(By.name("contact")).sendKeys(contact);

    driver.findElement(By.name("city")).sendKeys("Vavuniya");

    new Select(driver.findElement(By.name("isAvailable")))
            .selectByVisibleText("Available");

    driver.findElement(
            By.xpath("//button[normalize-space()='Create Donor']")
    ).click();

    // Handle success alert
    wait.until(ExpectedConditions.alertIsPresent());

    String alertMessage = driver.switchTo().alert().getText();

    System.out.println("ALERT MESSAGE: " + alertMessage);

    Assert.assertTrue(
            alertMessage.contains("Donor created successfully"),
            "Donor creation failed: " + alertMessage
    );

    driver.switchTo().alert().accept();

    // Verify donor appears in table
    wait.until(ExpectedConditions.textToBePresentInElementLocated(
            By.cssSelector("table"),
            donorName
    ));

    Assert.assertTrue(
            driver.findElement(By.cssSelector("table"))
                    .getText().contains(donorName)
    );

    System.out.println("PASS: New donor created successfully!");
}

    // TEST 3: Check empty form submission
@Test
public void verifyEmptyDonorFormValidation() {

    loginAndOpenDonors();

    openDonorForm();

    driver.findElement(
            By.xpath("//button[normalize-space()='Create Donor']")
    ).click();

    // Wait for the application alert
    wait.until(ExpectedConditions.alertIsPresent());

    String alertMessage = driver.switchTo().alert().getText();

    System.out.println("ACTUAL VALIDATION MESSAGE: " + alertMessage);

    driver.switchTo().alert().accept();

    // Check that the form remains visible
    Assert.assertTrue(
            driver.findElement(By.name("name")).isDisplayed(),
            "Donor form should remain visible after invalid submission."
    );

    // Verify that the error message is meaningful
    Assert.assertNotEquals(
            alertMessage.trim(),
            "Error: undefined",
            "BUG: Empty donor submission displays an undefined error message."
    );

    System.out.println("PASS: Empty donor validation works correctly!");
}

@Test
public void verifyDonorEditFormPrefilled() {

    loginAndOpenDonors();

    // Find Smith's row
    WebElement donorRow = driver.findElement(
            By.xpath("//tr[.//td[normalize-space()='Smith']]")
    );

    // Click Edit
    donorRow.findElement(
            By.xpath(".//button[normalize-space()='Edit']")
    ).click();

    // Wait for edit form
    wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("input[name='name']")
    ));

    // Verify existing details
    Assert.assertEquals(
            driver.findElement(By.name("name")).getAttribute("value"),
            "Smith"
    );

    Assert.assertEquals(
            new Select(driver.findElement(By.name("bloodGroup")))
                    .getFirstSelectedOption().getText(),
            "A+"
    );

    Assert.assertEquals(
            driver.findElement(By.name("age")).getAttribute("value"),
            "22"
    );

    Assert.assertEquals(
            driver.findElement(By.name("contact")).getAttribute("value"),
            "0987456123"
    );

    Assert.assertEquals(
            driver.findElement(By.name("city")).getAttribute("value"),
            "Berlin"
    );

    Assert.assertTrue(
            driver.findElement(
                    By.xpath("//button[normalize-space()='Update Donor']")
            ).isDisplayed()
    );

    System.out.println("PASS: Edit form displays existing donor details!");
}

@Test
public void verifySuccessfulDonorUpdate() {

    loginAndOpenDonors();

    WebElement donorRow = driver.findElement(
            By.xpath("//tr[.//td[normalize-space()='Smith']]")
    );

    donorRow.findElement(
            By.xpath(".//button[normalize-space()='Edit']")
    ).click();

    wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.xpath("//button[normalize-space()='Update Donor']")
    ));

    WebElement cityInput = driver.findElement(By.name("city"));

    cityInput.clear();
    cityInput.sendKeys("Vavuniya");

    driver.findElement(
            By.xpath("//button[normalize-space()='Update Donor']")
    ).click();

    wait.until(ExpectedConditions.alertIsPresent());

    String alertMessage = driver.switchTo().alert().getText();
    System.out.println("UPDATE ALERT: " + alertMessage);

    driver.switchTo().alert().accept();

    wait.until(ExpectedConditions.textToBePresentInElementLocated(
            By.cssSelector("table"), "Vavuniya"
    ));

    WebElement updatedRow = driver.findElement(
            By.xpath("//tr[.//td[normalize-space()='Smith']]")
    );

    Assert.assertTrue(
            updatedRow.getText().contains("Vavuniya"),
            "Donor city was not updated."
    );

    System.out.println("PASS: Donor updated successfully!");
}


@Test
public void verifySuccessfulDonorDeletion() {

    loginAndOpenDonors();

    WebElement donorRow = driver.findElement(
            By.xpath("//tr[.//td[contains(text(),'Selenium Donor')]]")
    );

    String donorName = donorRow.findElement(
            By.xpath("./td[1]")
    ).getText();

    donorRow.findElement(
            By.xpath(".//button[normalize-space()='Delete']")
    ).click();

    // Handle confirmation alert
    wait.until(ExpectedConditions.alertIsPresent());

    String confirmation = driver.switchTo().alert().getText();
    System.out.println("CONFIRMATION ALERT: " + confirmation);

    driver.switchTo().alert().accept();

    // Handle success alert
    wait.until(ExpectedConditions.alertIsPresent());

    String successMessage = driver.switchTo().alert().getText();
    System.out.println("SUCCESS ALERT: " + successMessage);

    Assert.assertTrue(
            successMessage.contains("Donor deleted successfully"),
            "Unexpected deletion success message."
    );

    driver.switchTo().alert().accept();

    // Verify donor is removed from the table
    wait.until(ExpectedConditions.numberOfElementsToBe(
            By.xpath("//tr[.//td[normalize-space()='" + donorName + "']]"),
            0
    ));

    System.out.println("PASS: Donor deleted successfully!");
}



}
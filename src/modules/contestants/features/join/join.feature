Feature: Join the group finder

  Scenario: Join the group finder
    Given a contestant who has not joined
    When the contestant joins the group finder
    Then the contestant is added to the group finder

  Scenario: Leaves the group finder
    Given a contestant who has joined
    When the contestant leaves the group finder
    Then the contestant is removed from the group finder
